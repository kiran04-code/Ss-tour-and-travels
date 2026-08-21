import "dotenv/config";
import type { Request, Response } from "express";
import { connectDatabase } from "../src/config/db.js";
import { createApp } from "../src/app.js";

let isDbConnected = false;

const app = createApp(process.env.FRONTEND_URL || "*");

export default async function handler(req: Request, res: Response) {
  if (!isDbConnected) {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/car-platform";
    try {
      await connectDatabase(mongoUri);
      isDbConnected = true;
    } catch (err) {
      console.error("Database connection failed on serverless handler:", err);
    }
  }
  return app(req, res);
}
