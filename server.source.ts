import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { handleStylistRequest } from "./services/stylistApi";
import { synthesizeCulturalTwinVisual, generateGeminiLookImage } from "./services/geminiVisual";

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Health check endpoints for container/cloud platforms (Google AI Studio / Cloud Run)
app.get(["/health", "/api/health"], (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "vietphuc-ai-studio",
    timestamp: new Date().toISOString(),
  });
});

// API: Stylist Evaluation & Recommendations
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

// API: Visual Studio Specifications
app.post("/api/gemini/visual-studio", async (req, res) => {
  try {
    const spec = await synthesizeCulturalTwinVisual(req.body);
    res.json(spec);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Visual studio spec error" });
  }
});

// API: Gemini Lookbook Image Generation
app.post("/api/gemini/generate-look", async (req, res) => {
  try {
    const result = await generateGeminiLookImage(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Generate look error" });
  }
});

const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const distPath = path.resolve(__dirname, "dist");
  const distIndex = path.resolve(distPath, "index.html");
  const hasDist = fs.existsSync(distIndex);

  // If in production AND dist directory exists, serve static bundle
  // Otherwise, automatically mount Vite middleware on-the-fly for development
  if (isProd && hasDist) {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(distIndex);
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);

    // Fallback to index.html for SPA routes (/dashbroad, /dashboard, /, /intro, etc.)
    app.use("*", async (req, res, next) => {
      if (req.originalUrl.startsWith("/api") || req.originalUrl === "/health") {
        return next();
      }
      try {
        const indexHtmlPath = path.resolve(__dirname, "index.html");
        const template = fs.readFileSync(indexHtmlPath, "utf-8");
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Việt Phục Remix server running on http://0.0.0.0:${PORT} (mode: ${
        isProd && hasDist ? "production static dist" : "development vite middleware"
      })`
    );
  });
}

startServer();
