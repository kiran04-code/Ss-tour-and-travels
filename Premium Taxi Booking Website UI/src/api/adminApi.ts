import { request } from "./client";
import type { Car, QuoteRequest, QuoteStatus, Stats } from "./types";

export const adminApi = {
  getStats() { return request<Stats>("/admin/stats"); },
  getQuotes(params: Record<string, string | undefined> = {}) { const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value).map(([key, value]) => [key, value!])); return request<QuoteRequest[]>(`/admin/quotes?${query}`); },
  getQuote(id: string) { return request<QuoteRequest>(`/admin/quotes/${id}`); },
  updateQuoteStatus(id: string, status: QuoteStatus) { return request<QuoteRequest>(`/admin/quotes/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); },
  getCars() { return request<{ items: Car[] }>("/admin/cars?limit=50"); },
  deleteCar(id: string) { return request<null>(`/cars/${id}`, { method: "DELETE" }); },
  updateCarStatus(id: string, status: Car["status"]) { return request<Car>(`/cars/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); },
  getNotifications() { return request<Array<{ id: string; message: string; quoteId: string; read: boolean }>>("/admin/notifications"); },
  markNotificationsRead() { return request<null>("/admin/notifications/read", { method: "PATCH" }); }
};
