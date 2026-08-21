import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { asyncHandler } from "../middleware/error.middleware.js";

export const adminRoutes = Router();
adminRoutes.get("/stats", asyncHandler(adminController.stats));
adminRoutes.get("/quotes", asyncHandler(adminController.quotes));
adminRoutes.get("/quotes/:id", asyncHandler(adminController.quote));
adminRoutes.patch("/quotes/:id/status", asyncHandler(adminController.quoteStatus));
adminRoutes.get("/cars", asyncHandler(adminController.cars));
adminRoutes.get("/notifications", asyncHandler(adminController.notifications));
adminRoutes.patch("/notifications/read", asyncHandler(adminController.readNotifications));
