import { Schema, model, type InferSchemaType } from "mongoose";

const carSchema = new Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1900, max: 2200 },
  description: { type: String, required: true, trim: true },
  images: { type: [String], default: [] },
  location: { type: String, required: true, trim: true },
  fuelType: { type: String, required: true, trim: true },
  transmission: { type: String, required: true, trim: true },
  ownerName: { type: String, required: true, trim: true },
  ownerPhone: { type: String, required: true, trim: true },
  ownerEmail: { type: String, required: true, lowercase: true, trim: true },
  status: { type: String, enum: ["available", "sold", "inactive"], default: "available", index: true }
}, { timestamps: true });

export type CarDocument = InferSchemaType<typeof carSchema> & { _id: string; createdAt: Date; updatedAt: Date };
export const Car = model("Car", carSchema);
