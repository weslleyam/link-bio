import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "atendimento@cembrasites.com.br",
    pass: "uE$lley@55524"
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes go here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/request-subscription", async (req, res) => {
    const { name, email, selectedPlan } = req.body;
    const date = new Date().toLocaleString('pt-BR');

    try {
      await transporter.sendMail({
        from: '"Cembra SaaS" <atendimento@cembrasites.com.br>',
        to: "weslleyam@gmail.com",
        subject: "Nova solicitação de assinatura",
        text: `Nova solicitação de assinatura recebida:

Nome: ${name}
Email: ${email}
Plano escolhido: ${selectedPlan === 'semestral' ? 'Semestral' : 'Mensal'}
Data da solicitação: ${date}`,
        html: `
          <h2>Nova solicitação de assinatura</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Plano escolhido:</strong> ${selectedPlan === 'semestral' ? 'Semestral' : 'Mensal'}</p>
          <p><strong>Data da solicitação:</strong> ${date}</p>
        `
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      res.status(500).json({ success: false, error: "Falha ao enviar email" });
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
