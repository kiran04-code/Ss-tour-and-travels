import "dotenv/config";
import type { Request, Response } from "express";
import { connectDatabase } from "../src/config/db.js";
import { createApp } from "../src/app.js";

const app = createApp(process.env.FRONTEND_URL || "*");

export default async function handler(req: Request, res: Response) {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("[Vercel Handler] Error: MONGODB_URI environment variable is not defined in Vercel settings!");
  } else {
    try {
      await connectDatabase(mongoUri);
    } catch (err) {
      console.error("[Vercel Handler] Database connection error:", (err as Error).message);
    }
  }
  return app(req, res);
}

