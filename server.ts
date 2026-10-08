import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { handleStylistRequest } from "./services/stylistApi.ts";

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// API endpoint for stylist actions (remix & repair)
app.post("/api/stylist", async (req, res) => {
  try {
    const result = await handleStylistRequest(req.body);
    res.json(result);
  } catch (err: any) {
    const status = err.statusCode || (err.status ? err.status : 500);
    res.status(status).json({
      error: err.message || "Internal server error",
    });
  }
});

const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cổ Phục GenZ server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
