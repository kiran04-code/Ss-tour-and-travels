import { Schema, model, type InferSchemaType } from "mongoose";

const quoteSchema = new Schema({
  carId: { type: Schema.Types.ObjectId, ref: "Car", required: true, index: true },
  customerName: { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true },
  customerEmail: { type: String, required: false, lowercase: true, trim: true },
  message: { type: String, required: true, trim: true },
  preferredContactMethod: { type: String, enum: ["phone", "email", "whatsapp"], default: "phone" },
  status: { type: String, enum: ["new", "contacted", "quoted", "closed"], default: "new", index: true }
}, { timestamps: true });

export type QuoteDocument = InferSchemaType<typeof quoteSchema> & { _id: string; createdAt: Date; updatedAt: Date };
export const QuoteRequest = model("QuoteRequest", quoteSchema);
