import { Router } from "express";
import { businessController } from "../controllers/business.controller.js";
import { asyncHandler } from "../middleware/error.middleware.js";
export const businessRoutes = Router();
businessRoutes.get("/social-links", asyncHandler(businessController.socialLinks));
businessRoutes.get("/location", asyncHandler(businessController.location));
businessRoutes.get("/google-reviews", asyncHandler(businessController.googleReviews));
