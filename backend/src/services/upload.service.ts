import { createHash } from "node:crypto";
import { ApiError } from "../utils/apiError.js";
const allowedImageTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/bmp",
  "image/tiff",
  "image/x-icon",
  "image/svg+xml"
]);

export async function uploadImage(buffer: Buffer, filename: string, mimeType: string) {
  const normalizedMime = mimeType.toLowerCase().split(";")[0].trim();
  if (!allowedImageTypes.has(normalizedMime) && !normalizedMime.startsWith("image/")) {
    throw new ApiError(422, "Please upload a valid image file (JPEG, PNG, WebP, HEIC, GIF, etc.)");
  }
  if (buffer.length > 50 * 1024 * 1024) {
    throw new ApiError(422, "Image must be smaller than 50 MB");
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "my_app_uploads";
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "car-platform";

  if (!cloudName) {
    throw new ApiError(503, "Cloudinary cloud name is missing. Set CLOUDINARY_CLOUD_NAME in .env.");
  }

  let lastErrorMsg = "";

  // Strategy 1: Unsigned Preset Upload
  if (uploadPreset) {
    try {
      const form = new FormData();
      form.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);
      form.append("upload_preset", uploadPreset);
      if (folder) form.append("folder", folder);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: form
      });
      const data = (await response.json()) as { secure_url?: string; public_id?: string; error?: { message?: string } };

      if (response.ok && data.secure_url) {
        return { url: data.secure_url, publicId: data.public_id };
      }
      lastErrorMsg = data.error?.message || `HTTP ${response.status}`;
    } catch (err) {
      lastErrorMsg = (err as Error).message;
    }
  }

  // Strategy 2: Signed Upload with API Key and Secret
  if (apiKey && apiSecret) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = createHash("sha1")
        .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
        .digest("hex");

      const form = new FormData();
      form.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("folder", folder);
      form.append("signature", signature);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: form
      });
      const data = (await response.json()) as { secure_url?: string; public_id?: string; error?: { message?: string } };

      if (response.ok && data.secure_url) {
        return { url: data.secure_url, publicId: data.public_id };
      }
      lastErrorMsg = data.error?.message || lastErrorMsg || `HTTP ${response.status}`;
    } catch (err) {
      lastErrorMsg = (err as Error).message;
    }
  }

  let userMessage = lastErrorMsg || "Cloudinary image upload failed.";
  if (userMessage.includes("preset") || userMessage.includes("Upload preset")) {
    userMessage = `Cloudinary Error: Upload preset '${uploadPreset}' was not found. Please log in to Cloudinary (console.cloudinary.com) > Settings > Upload > Add upload preset, name it '${uploadPreset}', set Signing Mode to 'Unsigned', and click Save.`;
  } else if (userMessage.includes('missing permissions (actions=["create"])')) {
    userMessage = "Cloudinary Error: The API key lacks 'create' upload permissions. Please set an unsigned CLOUDINARY_UPLOAD_PRESET (like 'my_app_uploads') or enable upload permissions on the API key.";
  }

  throw new ApiError(502, userMessage);
}

