import { Router } from "express";
import { galleryController } from "../controllers/gallery.controller.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
export const galleryRoutes = Router();
galleryRoutes.get("/", asyncHandler(galleryController.list));
galleryRoutes.post("/", requireAdmin, asyncHandler(galleryController.create));
galleryRoutes.delete("/:id", requireAdmin, asyncHandler(galleryController.remove));
