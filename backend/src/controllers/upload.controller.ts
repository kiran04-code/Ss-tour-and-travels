import type { Request, Response } from "express";
import { uploadImage } from "../services/upload.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
export const uploadController = { async image(req: Request, res: Response) { if (!req.body || !Buffer.isBuffer(req.body) || !req.body.length) return sendError(res, "Select an image to upload", undefined, 422); if (!String(req.headers["content-type"] || "").startsWith("image/")) return sendError(res, "Only image files are allowed", undefined, 422); const filename = decodeURIComponent(String(req.headers["x-file-name"] || "car-image")); return sendSuccess(res, await uploadImage(req.body, filename, String(req.headers["content-type"])), "Image uploaded"); } };
