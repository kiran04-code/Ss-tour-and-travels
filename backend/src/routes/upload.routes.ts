import { Router } from "express";
import { uploadController } from "../controllers/upload.controller.js";
import { asyncHandler } from "../middleware/error.middleware.js";
export const uploadRoutes = Router();
uploadRoutes.post("/images", asyncHandler(uploadController.image));
