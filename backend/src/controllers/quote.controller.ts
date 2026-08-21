import type { Request, Response } from "express";
import { quoteService } from "../services/quote.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

export const quoteController = {
  async create(req: Request, res: Response) {
    const required = ["carId", "customerName", "customerPhone", "message"];
    const missing = required.filter((field) => !req.body[field]);
    if (missing.length) return sendError(res, "Missing required fields", { missing }, 422);
    if (req.body.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(req.body.customerEmail).trim())) {
      return sendError(res, "Invalid customer email", undefined, 422);
    }
    if (!/^[0-9+()\-\s]{7,20}$/.test(String(req.body.customerPhone))) return sendError(res, "Invalid customer phone", undefined, 422);
    return sendSuccess(res, await quoteService.create(req.body), "Quote request received", 201);
  }
};
