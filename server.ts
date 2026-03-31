import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = new Resend("re_DRbjaM5f_7v3Vsj9Bj2xJU8KfJmNEQowf");

async function startServer() {
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
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from the dist directory in production
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
