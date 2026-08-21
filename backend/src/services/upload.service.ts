import { createHash } from "node:crypto";
import { ApiError } from "../utils/apiError.js";
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export async function uploadImage(buffer: Buffer, filename: string, mimeType: string) {
  if (!allowedImageTypes.has(mimeType.toLowerCase())) throw new ApiError(422, "Use a JPEG, PNG, WebP, GIF, or AVIF image");
  if (buffer.length > 50 * 1024 * 1024) throw new ApiError(422, "Image must be smaller than 50 MB");

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "car-platform";

  if (!cloudName) {
    throw new ApiError(503, "Cloudinary cloud name is missing. Set CLOUDINARY_CLOUD_NAME in .env.");
  }
  if (!uploadPreset && (!apiKey || !apiSecret)) {
    throw new ApiError(503, "Cloudinary configuration missing. Set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (or CLOUDINARY_UPLOAD_PRESET) in .env.");
  }

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);

  if (uploadPreset) {
    form.append("upload_preset", uploadPreset);
    if (folder) form.append("folder", folder);
  } else if (apiKey && apiSecret) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex");
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("folder", folder);
    form.append("signature", signature);
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
  const data = await response.json() as { secure_url?: string; public_id?: string; error?: { message?: string } };

  if (!response.ok || !data.secure_url) {
    let message = data.error?.message || "Cloudinary upload failed";
    if (message.includes("Upload preset must be specified") || message.includes("Upload preset not found") || message.includes("preset")) {
      message = `Cloudinary Error: Upload preset '${uploadPreset || ""}' was not found. Please log in to Cloudinary (console.cloudinary.com) > Settings > Upload > Add upload preset, name it '${uploadPreset || "my_app_uploads"}', set Signing Mode to 'Unsigned', and click Save.`;
    } else if (message.includes('missing permissions (actions=["create"])') || response.status === 403) {
      message = "Cloudinary Error: The configured API key lacks 'create' permissions. Please enable Create/Upload permissions on this key in Cloudinary Console (Settings > Access Keys), use the Master API Key, or set CLOUDINARY_UPLOAD_PRESET in .env.";
    }
    throw new ApiError(response.status >= 400 && response.status < 500 ? response.status : 502, message);
  }

  return { url: data.secure_url, publicId: data.public_id };
}

