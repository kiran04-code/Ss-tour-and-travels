import { Schema, model } from "mongoose";
const galleryImageSchema = new Schema({ url: { type: String, required: true, trim: true }, publicId: { type: String, trim: true }, alt: { type: String, trim: true, maxlength: 140, default: "SS Tours journey" } }, { timestamps: true });
export const GalleryImage = model("GalleryImage", galleryImageSchema);
