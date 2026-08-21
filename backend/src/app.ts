import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { connectDatabase } from "./config/db.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { carRoutes } from "./routes/car.routes.js";
import { quoteRoutes } from "./routes/quote.routes.js";
import { uploadRoutes } from "./routes/upload.routes.js";
import { galleryRoutes } from "./routes/gallery.routes.js";
import { businessRoutes } from "./routes/business.routes.js";
import { seoRoutes } from "./routes/seo.routes.js";
import { requireAdmin } from "./middleware/admin.middleware.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

export function createApp(frontendUrl: string) {
  const app = express();

  const dynamicOrigins = typeof frontendUrl === "string"
    ? frontendUrl.split(",").map((url: string) => url.trim().replace(/\/$/, "")).filter(Boolean)
    : [];

  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://ss-tour-and-travels-seven.vercel.app",
    "https://ss-tour-and-travels-w7kp.vercel.app",
    ...dynamicOrigins
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, serverless)
        if (!origin) return callback(null, true);
        const normalized = origin.replace(/\/$/, "");
        if (
          frontendUrl === "*" ||
          allowedOrigins.includes(normalized) ||
          normalized.endsWith(".vercel.app")
        ) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive CORS for seamless API access
      },
      credentials: true,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Admin-Token",
        "X-File-Name",
        "x-file-name",
        "Accept",
        "Origin",
        "X-Requested-With"
      ],
      exposedHeaders: ["Content-Range", "X-Content-Range"]
    })
  );
  app.use(
    "/api/uploads",
    requireAdmin,
    express.raw({ type: () => true, limit: "50mb" }),
    uploadRoutes
  );
  app.use(express.json({ limit: "1mb" }));
  app.get("/api/health", (_req, res) => res.json({ success: true, message: "API is healthy", data: { uptime: process.uptime() } }));

  // Ensure MongoDB is connected before querying in serverless
  app.use(async (req, _res, next) => {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && mongoose.connection.readyState !== 1) {
      try {
        await connectDatabase(mongoUri);
      } catch (err) {
        return next(err);
      }
    }
    next();
  });

  app.use("/api/cars", carRoutes);
  app.use("/api/quotes", quoteRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/gallery", galleryRoutes);
  app.use("/api/business", businessRoutes);
  app.use("/api/seo", seoRoutes);
  app.use("/", seoRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
