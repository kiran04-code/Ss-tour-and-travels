import { Router } from "express";
import { carController } from "../controllers/car.controller.js";
import { asyncHandler } from "../middleware/error.middleware.js";

export const carRoutes = Router();
carRoutes.get("/", asyncHandler(carController.list));
carRoutes.get("/:id", asyncHandler(carController.get));
carRoutes.post("/", asyncHandler(carController.create));
carRoutes.put("/:id", asyncHandler(carController.update));
carRoutes.delete("/:id", asyncHandler(carController.remove));
carRoutes.patch("/:id/status", asyncHandler(carController.status));
