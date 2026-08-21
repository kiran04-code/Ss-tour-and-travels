import { Router } from "express";
import { quoteController } from "../controllers/quote.controller.js";
import { asyncHandler } from "../middleware/error.middleware.js";

export const quoteRoutes = Router();
quoteRoutes.post("/", asyncHandler(quoteController.create));
