import type { Request, Response } from "express";
import { GalleryImage } from "../models/GalleryImage.js";
import { ApiError } from "../utils/apiError.js";
import { sendSuccess } from "../utils/apiResponse.js";
export const galleryController = {
  async list(_req: Request, res: Response) { return sendSuccess(res, await GalleryImage.find().sort({ createdAt: -1 }).lean()); },
  async create(req: Request, res: Response) { const { url, publicId, alt } = req.body; if (!url || typeof url !== "string" || !/^https?:\/\//.test(url)) throw new ApiError(422, "A valid uploaded image URL is required"); return sendSuccess(res, await GalleryImage.create({ url, publicId, alt }), "Gallery image added", 201); },
  async remove(req: Request, res: Response) { const image = await GalleryImage.findByIdAndDelete(req.params.id); if (!image) throw new ApiError(404, "Gallery image not found"); return sendSuccess(res, null, "Gallery image deleted"); }
};
