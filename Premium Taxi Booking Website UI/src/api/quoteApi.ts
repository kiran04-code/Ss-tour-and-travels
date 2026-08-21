import { request } from "./client";
import type { ContactMethod, QuoteRequest } from "./types";

export interface QuotePayload { carId: string; customerName: string; customerPhone: string; customerEmail?: string; message: string; preferredContactMethod: ContactMethod }
export type SubmittedQuote = QuoteRequest & { whatsappUrl?: string };
export const quoteApi = { createQuote(data: QuotePayload) { return request<SubmittedQuote>("/quotes", { method: "POST", body: JSON.stringify(data) }); } };
