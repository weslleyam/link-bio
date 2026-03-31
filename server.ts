import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import mysql from "mysql2/promise";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = new Resend(process.env.RESEND_API_KEY || "re_DRbjaM5f_7v3Vsj9Bj2xJU8KfJmNEQowf");

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "biolink",
};

// Fallback JSON database for environments without MySQL (like the AIS preview)
const JSON_DB_PATH = path.join(__dirname, "biolink_db.json");

interface LocalDb {
  users: any[];
  pages: any[];
  links: any[];
  products: any[];
}

let localDb: LocalDb = {
  users: [],
  pages: [],
  links: [],
  products: [],
};

async function loadLocalDb() {
  try {
    const data = await fs.readFile(JSON_DB_PATH, "utf-8");
    localDb = JSON.parse(data);
  } catch (error) {
    // File doesn't exist, use default empty state
    await saveLocalDb();
  }
}

async function saveLocalDb() {
  try {
    await fs.writeFile(JSON_DB_PATH, JSON.stringify(localDb, null, 2));
  } catch (error) {
    console.error("Erro ao salvar banco local:", error);
  }
}

let pool: mysql.Pool | null = null;
let useLocalFallback = false;

async function initDb() {
  try {
    // Try to connect to MySQL
    pool = mysql.createPool({
      ...dbConfig,
      connectTimeout: 2000, // Short timeout for faster fallback
    });
    
    // Test connection
    await pool.getConnection();
    console.log("Conectado ao MySQL com sucesso");

    // Create tables if they don't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        username VARCHAR(255) UNIQUE,
        passwordHash VARCHAR(255),
        createdAt DATETIME,
        status VARCHAR(50),
        subscriptionStatus VARCHAR(50),
        trialExpiresAt DATETIME
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS pages (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255),
        title VARCHAR(255),
        description TEXT,
        theme VARCHAR(255),
        profileImage TEXT,
        customCss TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS links (
        id VARCHAR(255) PRIMARY KEY,
        bioPageId VARCHAR(255),
        title VARCHAR(255),
        url TEXT,
        icon VARCHAR(255),
        position INT,
        isActive BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (bioPageId) REFERENCES pages(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        bioPageId VARCHAR(255),
        title VARCHAR(255),
        description TEXT,
        price DECIMAL(10, 2),
        imageUrl TEXT,
        link TEXT,
        position INT,
        FOREIGN KEY (bioPageId) REFERENCES pages(id) ON DELETE CASCADE
      )
    `);

    console.log("Tabelas do banco de dados verificadas/criadas");
  } catch (error) {
    console.warn("MySQL indisponível (ECONNREFUSED). Usando persistência em arquivo JSON local para o ambiente de preview.");
    useLocalFallback = true;
    await loadLocalDb();
  }
}

async function startServer() {
  await initDb();
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Rota de teste de email
  app.get("/test-email", async (req, res) => {
    try {
      await resend.emails.send({
        from: "Cembra SaaS <onboarding@resend.dev>",
        to: ["weslleyam@gmail.com"],
        subject: "Email de Teste - Cembra SaaS",
        text: `Este é um email de teste enviado em ${new Date().toLocaleString()}`
      });
      console.log("Email de teste enviado com sucesso");
      res.send("Email de teste enviado");
    } catch (error) {
      console.error("Erro ao enviar email de teste:", error);
      res.status(500).send("Erro ao enviar email: " + error);
    }
  });

  // Rota de teste de banco de dados
  app.post("/test-db", async (req, res) => {
    console.log("Teste de banco de dados recebido:", req.body);
    try {
      if (useLocalFallback) {
        const newUser = { id: "test-id", name: "Test User", email: "test@example.com", status: "active" };
        localDb.users = localDb.users.filter(u => u.id !== newUser.id);
        localDb.users.push(newUser);
        await saveLocalDb();
        return res.status(200).json({ success: true, mode: "local_json" });
      }

      const [result] = await pool!.execute(
        "INSERT INTO users (id, name, email, status) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status)",
        ["test-id", "Test User", "test@example.com", "active"]
      );
      res.status(200).json({ success: true, result, mode: "mysql" });
    } catch (error) {
      console.error("Erro no teste de banco:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Proxy para db_bridge.php para manter compatibilidade com o frontend sem alterá-lo
  app.all("/db_bridge.php", async (req, res) => {
    const action = req.query.action || req.body?.action;
    const method = req.method;
    console.log(`DB Bridge Action: ${action}`, method, req.body, req.query);

    try {
      if (method === 'GET') {
        if (action === 'sync_all') {
          if (useLocalFallback) {
            return res.json(localDb);
          }
          const [users] = await pool!.execute("SELECT * FROM users");
          const [pages] = await pool!.execute("SELECT * FROM pages");
          const [links] = await pool!.execute("SELECT * FROM links");
          const [products] = await pool!.execute("SELECT * FROM products");
          return res.json({ users, pages, links, products });
        }
        if (action === 'delete_link') {
          const id = req.query.id;
          if (useLocalFallback) {
            localDb.links = localDb.links.filter(l => l.id !== id);
            await saveLocalDb();
            return res.json({ success: true });
          }
          await pool!.execute("DELETE FROM links WHERE id = ?", [id]);
          return res.json({ success: true });
        }
        if (action === 'delete_product') {
          const id = req.query.id;
          if (useLocalFallback) {
            localDb.products = localDb.products.filter(p => p.id !== id);
            await saveLocalDb();
            return res.json({ success: true });
          }
          await pool!.execute("DELETE FROM products WHERE id = ?", [id]);
          return res.json({ success: true });
        }
      }

      if (method === 'POST') {
        const data = req.body;
        if (action === 'save_user') {
          if (useLocalFallback) {
            localDb.users = localDb.users.filter(u => u.id !== data.id);
            localDb.users.push(data);
            await saveLocalDb();
            return res.json({ success: true });
          }
          await pool!.execute(
            `INSERT INTO users (id, name, email, username, passwordHash, createdAt, status, subscriptionStatus, trialExpiresAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             name = VALUES(name), email = VALUES(email), username = VALUES(username), 
             passwordHash = VALUES(passwordHash), status = VALUES(status), 
             subscriptionStatus = VALUES(subscriptionStatus), trialExpiresAt = VALUES(trialExpiresAt)`,
            [data.id, data.name, data.email, data.username, data.passwordHash, data.createdAt, data.status, data.subscriptionStatus, data.trialExpiresAt]
          );
          return res.json({ success: true });
        }
        if (action === 'save_page') {
          if (useLocalFallback) {
            localDb.pages = localDb.pages.filter(p => p.id !== data.id);
            localDb.pages.push(data);
            await saveLocalDb();
            return res.json({ success: true });
          }
          await pool!.execute(
            `INSERT INTO pages (id, userId, title, description, theme, profileImage, customCss) 
             VALUES (?, ?, ?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             title = VALUES(title), description = VALUES(description), theme = VALUES(theme), 
             profileImage = VALUES(profileImage), customCss = VALUES(customCss)`,
            [data.id, data.userId, data.title, data.description, data.theme, data.profileImage, data.customCss]
          );
          return res.json({ success: true });
        }
        if (action === 'save_link') {
          if (useLocalFallback) {
            localDb.links = localDb.links.filter(l => l.id !== data.id);
            localDb.links.push(data);
            await saveLocalDb();
            return res.json({ success: true });
          }
          await pool!.execute(
            `INSERT INTO links (id, bioPageId, title, url, icon, position, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             title = VALUES(title), url = VALUES(url), icon = VALUES(icon), 
             position = VALUES(position), isActive = VALUES(isActive)`,
            [data.id, data.bioPageId, data.title, data.url, data.icon, data.position, data.isActive ? 1 : 0]
          );
          return res.json({ success: true });
        }
        if (action === 'save_product') {
          if (useLocalFallback) {
            localDb.products = localDb.products.filter(p => p.id !== data.id);
            localDb.products.push(data);
            await saveLocalDb();
            return res.json({ success: true });
          }
          await pool!.execute(
            `INSERT INTO products (id, bioPageId, title, description, price, imageUrl, link, position) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             title = VALUES(title), description = VALUES(description), price = VALUES(price), 
             imageUrl = VALUES(imageUrl), link = VALUES(link), position = VALUES(position)`,
            [data.id, data.bioPageId, data.title, data.description, data.price, data.imageUrl, data.link, data.position]
          );
          return res.json({ success: true });
        }
        if (action === 'request_subscription') {
          return res.json({ success: true });
        }
      }

      return res.status(400).json({ error: `Unknown action or method: ${action} [${method}]` });
    } catch (error) {
      console.error(`Error in DB Bridge (${action}):`, error);
      return res.status(500).json({ success: false, error: String(error) });
    }
  });

  // API routes go here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/request-subscription", async (req, res) => {
    const { name, email, selectedPlan } = req.body;
    const date = new Date().toLocaleString('pt-BR');

    try {
      await resend.emails.send({
        from: "Cembra SaaS <onboarding@resend.dev>",
        to: ["weslleyam@gmail.com"],
        subject: "Nova solicitação de assinatura",
        text: `
Nome: ${name}
Email: ${email}
Plano: ${selectedPlan === 'semestral' ? 'Semestral' : 'Mensal'}
Data: ${date}
        `
      });
      console.log("Email enviado com sucesso");
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      res.status(500).json({ success: false, error: "Falha ao enviar email: " + error });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from the dist directory in production
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
