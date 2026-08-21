import type { Request, Response } from "express";
import { carService } from "../services/car.service.js";
import { notificationService } from "../services/notification.service.js";
import { quoteService } from "../services/quote.service.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const adminController = {
  async stats(_req: Request, res: Response) { return sendSuccess(res, await quoteService.stats()); },
  async quotes(req: Request, res: Response) { return sendSuccess(res, await quoteService.list(req.query as Record<string, string | undefined>)); },
  async quote(req: Request, res: Response) { return sendSuccess(res, await quoteService.get(String(req.params.id))); },
  async quoteStatus(req: Request, res: Response) { return sendSuccess(res, await quoteService.updateStatus(String(req.params.id), req.body.status), "Quote status updated"); },
  async cars(req: Request, res: Response) { return sendSuccess(res, await carService.list(req.query as Record<string, string | undefined>)); },
  async notifications(_req: Request, res: Response) { return sendSuccess(res, notificationService.list()); },
  async readNotifications(_req: Request, res: Response) { notificationService.markRead(); return sendSuccess(res, null, "Notifications marked read"); }
};
