import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.method === "OPTIONS") {
    return next();
  }
  const token = req.header("authorization")?.replace(/^Bearer\s+/i, "") || req.header("x-admin-token");
  const expected = process.env.ADMIN_API_TOKEN || "demo-token-ss-tours-2026";
  if (!token || token !== expected) {
    return next(new ApiError(401, "Admin authorization is required. Please log in to continue."));
  }
  next();
}
