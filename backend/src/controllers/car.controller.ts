import type { Request, Response } from "express";
import { carService } from "../services/car.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const required = ["name", "brand", "model", "year", "description", "location", "fuelType", "transmission", "ownerName", "ownerPhone", "ownerEmail"];

export const carController = {
  async list(req: Request, res: Response) { return sendSuccess(res, await carService.list(req.query as Record<string, string | undefined>)); },
  async get(req: Request, res: Response) { return sendSuccess(res, await carService.get(String(req.params.id))); },
  async create(req: Request, res: Response) {
    const missing = required.filter((field) => req.body[field] === undefined || req.body[field] === "");
    if (missing.length) return sendError(res, "Missing required fields", { missing }, 422);
    if (!Array.isArray(req.body.images) || req.body.images.length === 0) return sendError(res, "Add at least one image URL", undefined, 422);
    if (req.body.images.length > 12 || new Set(req.body.images).size !== req.body.images.length || req.body.images.some((image: unknown) => typeof image !== "string" || !/^https?:\/\//i.test(image))) return sendError(res, "Images must be unique valid http(s) URLs (maximum 12)", undefined, 422);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(req.body.ownerEmail))) return sendError(res, "Invalid owner email", undefined, 422);
    if (!/^[0-9+()\-\s]{7,20}$/.test(String(req.body.ownerPhone))) return sendError(res, "Invalid owner phone", undefined, 422);
    return sendSuccess(res, await carService.create(req.body), "Car created successfully", 201);
  },
  async update(req: Request, res: Response) { return sendSuccess(res, await carService.update(String(req.params.id), req.body), "Car updated successfully"); },
  async remove(req: Request, res: Response) { await carService.remove(String(req.params.id)); return sendSuccess(res, null, "Car deleted successfully"); },
  async status(req: Request, res: Response) { return sendSuccess(res, await carService.updateStatus(String(req.params.id), req.body.status), "Car status updated successfully"); }
};
