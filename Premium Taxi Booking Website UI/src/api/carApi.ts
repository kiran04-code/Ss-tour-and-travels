import { request } from "./client";
import type { Car, PaginatedCars } from "./types";

export type CarPayload = Omit<Car, "_id" | "createdAt" | "updatedAt">;
export const carApi = {
  getCars(params: Record<string, string | number | undefined> = {}) { const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== "").map(([key, value]) => [key, String(value)])); return request<PaginatedCars>(`/cars?${query}`); },
  getCar(id: string) { return request<Car>(`/cars/${id}`); },
  createCar(data: Partial<CarPayload>) { return request<Car>("/cars", { method: "POST", body: JSON.stringify(data) }); },
  updateCar(id: string, data: Partial<CarPayload>) { return request<Car>(`/cars/${id}`, { method: "PUT", body: JSON.stringify(data) }); },
  deleteCar(id: string) { return request<null>(`/cars/${id}`, { method: "DELETE" }); },
  updateStatus(id: string, status: Car["status"]) { return request<Car>(`/cars/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); }
};
