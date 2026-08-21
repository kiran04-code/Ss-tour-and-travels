import { Car } from "../models/Car.js";
import { QuoteRequest } from "../models/QuoteRequest.js";
import { ApiError } from "../utils/apiError.js";

type CarInput = {
  name: string; brand: string; model: string; year: number; description: string; images?: string[];
  location: string; fuelType: string; transmission: string; ownerName: string; ownerPhone: string; ownerEmail: string; status?: string;
};

function cleanInput(input: Partial<CarInput>) {
  const output: Record<string, unknown> = { ...input };
  if (input.images !== undefined) output.images = [...new Set(input.images.filter(Boolean))].slice(0, 12);
  if (input.year !== undefined) output.year = Number(input.year);
  return output;
}

export const carService = {
  async list(query: Record<string, string | undefined>) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50);
    const filter: Record<string, unknown> = {};
    if (query.brand) filter.brand = new RegExp(query.brand, "i");
    if (query.location) filter.location = new RegExp(query.location, "i");
    if (query.fuelType) filter.fuelType = query.fuelType;
    if (query.transmission) filter.transmission = query.transmission;
    if (query.search) filter.$or = ["name", "brand", "model", "location"].map((field) => ({ [field]: new RegExp(query.search!, "i") }));
    const [items, total] = await Promise.all([Car.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Car.countDocuments(filter)]);
    return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  },
  async get(id: string) {
    const car = await Car.findById(id).lean();
    if (!car) throw new ApiError(404, "Car not found");
    return car;
  },
  async create(input: CarInput) { return Car.create(cleanInput(input)); },
  async update(id: string, input: Partial<CarInput>) {
    const car = await Car.findByIdAndUpdate(id, cleanInput(input), { new: true, runValidators: true }).lean();
    if (!car) throw new ApiError(404, "Car not found");
    return car;
  },
  async remove(id: string) {
    const car = await Car.findByIdAndDelete(id);
    if (!car) throw new ApiError(404, "Car not found");
    await QuoteRequest.deleteMany({ carId: id });
  },
  async updateStatus(id: string, status: string) {
    if (!["available", "sold", "inactive"].includes(status)) throw new ApiError(422, "Invalid car status");
    const car = await Car.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).lean();
    if (!car) throw new ApiError(404, "Car not found");
    return car;
  }
};
