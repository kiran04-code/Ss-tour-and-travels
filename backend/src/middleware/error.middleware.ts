import type { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { sendError } from "../utils/apiResponse.js";

export const notFound: RequestHandler = (_req, res) => sendError(res, "Route not found", undefined, 404);

export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) return sendError(res, error.message, error.details, error.statusCode);
  if (error instanceof mongoose.Error.ValidationError) {
    const details = Object.values(error.errors).map((item) => item.message);
    return sendError(res, "Validation failed", details, 422);
  }
  if (error instanceof mongoose.Error.CastError) return sendError(res, "Invalid resource id", undefined, 400);
  console.error("[Unhandled Error]:", error);
  const message = error instanceof Error ? error.message : "Internal server error";
  return sendError(res, message, undefined, 500);
};
