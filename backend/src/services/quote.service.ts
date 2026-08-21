import mongoose from "mongoose";
import { Car } from "../models/Car.js";
import { QuoteRequest } from "../models/QuoteRequest.js";
import { ApiError } from "../utils/apiError.js";
import { notificationService } from "./notification.service.js";
import { emailService } from "./email.service.js";

export const quoteService = {
  async create(input: { carId: string; customerName: string; customerPhone: string; customerEmail?: string; message: string; preferredContactMethod?: string }) {
    let car = null;
    if (input.carId && mongoose.isValidObjectId(input.carId)) {
      car = await Car.findById(input.carId).lean();
    }
    if (!car) {
      car = await Car.findOne({ status: "available" }).lean() || await Car.findOne().lean();
    }
    if (!car) {
      car = await Car.create({
        name: "Standard AC Taxi",
        brand: "Toyota / Maruti",
        year: 2024,
        description: "Comfortable AC Solapur Taxi",
        location: "Solapur",
        fuelType: "Diesel",
        transmission: "Manual",
        ownerName: "SS Tours & Travels",
        ownerPhone: "+918010374300",
        ownerEmail: "sstourssolapur@gmail.com",
        status: "available"
      });
    }
    const quote = await QuoteRequest.create({ ...input, carId: car._id });
    notificationService.notifyNewQuote(String(quote._id), car.name);

    // Asynchronously send email notification to admin without blocking the response
    void emailService.sendNewQuoteNotification({
      quoteId: String(quote._id),
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      message: input.message,
      carName: car.name,
      preferredContactMethod: input.preferredContactMethod,
      createdAt: quote.createdAt
    }).catch((err) => console.error("[Quote Service] Email alert error:", (err as Error).message));

    const savedQuote = await QuoteRequest.findById(quote._id).populate("carId").lean();
    const recipient = (process.env.WHATSAPP_QUOTE_NUMBER || "").replace(/\D/g, "");
    if (!recipient) return savedQuote;
    const message = `Hello SS Tours & Travels,\n\nI want to book a taxi for:\n• Journey / Details: ${input.message}\n• Vehicle: ${car.name}\n\nMy Details:\n• Name: ${input.customerName}\n• Mobile: ${input.customerPhone}\n\nPlease share the fare quote and cab availability. Thank you!`;
    return { ...savedQuote, whatsappUrl: `https://wa.me/${recipient}?text=${encodeURIComponent(message)}` };
  },
  async list(query: Record<string, string | undefined>) {
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.date) { const start = new Date(query.date); const end = new Date(start); end.setDate(end.getDate() + 1); filter.createdAt = { $gte: start, $lt: end }; }
    if (query.car) filter.carId = query.car;
    const quotes = await QuoteRequest.find(filter).populate("carId").sort({ createdAt: -1 }).lean();
    if (!query.search) return quotes;
    const search = query.search.toLowerCase();
    return quotes.filter((quote) => quote.customerName.toLowerCase().includes(search) || quote.customerPhone.includes(search) || (quote.customerEmail && quote.customerEmail.toLowerCase().includes(search)) || (quote.carId as { name?: string })?.name?.toLowerCase().includes(search));
  },
  async get(id: string) {
    const quote = await QuoteRequest.findById(id).populate("carId").lean();
    if (!quote) throw new ApiError(404, "Quote request not found");
    return quote;
  },
  async updateStatus(id: string, status: string) {
    if (!["new", "contacted", "quoted", "closed"].includes(status)) throw new ApiError(422, "Invalid quote status");
    const quote = await QuoteRequest.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).populate("carId").lean();
    if (!quote) throw new ApiError(404, "Quote request not found");
    return quote;
  },
  async stats() {
    const [totalCars, activeCars, soldCars, totalQuoteRequests, newQuoteRequests, contactedRequests, quotedRequests] = await Promise.all([
      Car.countDocuments(), Car.countDocuments({ status: "available" }), Car.countDocuments({ status: "sold" }), QuoteRequest.countDocuments(), QuoteRequest.countDocuments({ status: "new" }), QuoteRequest.countDocuments({ status: "contacted" }), QuoteRequest.countDocuments({ status: "quoted" })
    ]);
    return { totalCars, activeCars, soldCars, totalQuoteRequests, newQuoteRequests, contactedRequests, quotedRequests };
  }
};
