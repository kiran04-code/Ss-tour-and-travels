import type { Request, Response } from "express";
import { uploadImage } from "../services/upload.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

function getMimeType(headerType: string, filename: string): string {
  const cleanHeader = (headerType || "").split(";")[0].trim().toLowerCase();
  if (cleanHeader.startsWith("image/")) return cleanHeader;
  
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
      return "image/heic";
    case "heif":
      return "image/heif";
    case "avif":
      return "image/avif";
    case "gif":
      return "image/gif";
    case "bmp":
      return "image/bmp";
    default:
      return cleanHeader || "image/jpeg";
  }
}

export const uploadController = {
  async image(req: Request, res: Response) {
    if (!req.body || !Buffer.isBuffer(req.body) || !req.body.length) {
      return sendError(res, "Select an image to upload", undefined, 422);
    }
    const filename = decodeURIComponent(String(req.headers["x-file-name"] || "car-image.jpg"));
    const mimeType = getMimeType(String(req.headers["content-type"] || ""), filename);

    if (!mimeType.startsWith("image/")) {
      return sendError(res, "Only image files are allowed", undefined, 422);
    }
    return sendSuccess(res, await uploadImage(req.body, filename, mimeType), "Image uploaded");
  }
};

