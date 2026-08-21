import cors from "cors";
import express from "express";
import { adminRoutes } from "./routes/admin.routes.js";
import { carRoutes } from "./routes/car.routes.js";
import { quoteRoutes } from "./routes/quote.routes.js";
import { uploadRoutes } from "./routes/upload.routes.js";
import { galleryRoutes } from "./routes/gallery.routes.js";
import { businessRoutes } from "./routes/business.routes.js";
import { requireAdmin } from "./middleware/admin.middleware.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

export function createApp(frontendUrl = "http://localhost:5173") {
  const app = express();
  app.use(cors({ origin: frontendUrl.split(",").map((url) => url.trim()) }));
  app.use("/api/uploads", requireAdmin, express.raw({ type: "image/*", limit: "50mb" }), uploadRoutes);
  app.use(express.json({ limit: "1mb" }));
  app.get("/api/health", (_req, res) => res.json({ success: true, message: "API is healthy", data: { uptime: process.uptime() } }));
  app.use("/api/cars", carRoutes);
  app.use("/api/quotes", quoteRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/gallery", galleryRoutes);
  app.use("/api/business", businessRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
