import { Car } from "../models/Car.js";
import { QuoteRequest } from "../models/QuoteRequest.js";
import { ApiError } from "../utils/apiError.js";
import { notificationService } from "./notification.service.js";

export const quoteService = {
  async create(input: { carId: string; customerName: string; customerPhone: string; customerEmail: string; message: string; preferredContactMethod?: string }) {
    const car = await Car.findById(input.carId).lean();
    if (!car) throw new ApiError(404, "Car not found");
    const quote = await QuoteRequest.create(input);
    notificationService.notifyNewQuote(String(quote._id), car.name);
    const savedQuote = await QuoteRequest.findById(quote._id).populate("carId").lean();
    const recipient = (process.env.WHATSAPP_QUOTE_NUMBER || "").replace(/\D/g, "");
    if (!recipient) return savedQuote;
    const message = `Hello, I would like to request a quote for this car.\n\nCAR DETAILS\nCar: ${car.name}\nBrand: ${car.brand}\nModel: ${car.model}\nYear: ${car.year}\nDescription: ${car.description}\nFuel: ${car.fuelType}\nTransmission: ${car.transmission}\nLocation: ${car.location}\n\nCLIENT DETAILS\nName: ${input.customerName}\nWhatsApp: ${input.customerPhone}\n\nREQUEST\n${input.message}\n\nPlease contact me regarding this car.`;
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
    return quotes.filter((quote) => quote.customerName.toLowerCase().includes(search) || quote.customerPhone.includes(search) || quote.customerEmail.toLowerCase().includes(search) || (quote.carId as { name?: string })?.name?.toLowerCase().includes(search));
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
