import { API_URL } from "./client";

function resolveMimeType(file: File): string {
  if (file.type && file.type.startsWith("image/")) {
    return file.type.split(";")[0].trim().toLowerCase();
  }
  const ext = file.name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
      return "image/heic";
    case "heif":
      return "image/heif";
    case "avif":
      return "image/avif";
    case "gif":
      return "image/gif";
    case "bmp":
      return "image/bmp";
    default:
      return "image/jpeg";
  }
}

async function compressImage(file: File, maxDimension = 1920, quality = 0.8): Promise<File> {
  const mime = resolveMimeType(file);

  // If animated gif or svg, leave untouched
  if (mime === "image/gif" || mime === "image/svg+xml") {
    return file;
  }

  // If already under 1.8 MB and not HEIC, no compression strictly needed
  if (file.size < 1.8 * 1024 * 1024 && mime !== "image/heic" && mime !== "image/heif") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    const cleanup = () => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    };

    img.onload = () => {
      cleanup();
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file);

      ctx.drawImage(img, 0, 0, width, height);

      // Convert all photographic formats or HEIC/PNG to image/jpeg for reliable mobile uploads
      const outputType = mime === "image/png" && file.size < 2 * 1024 * 1024 ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
          } else {
            const newName = file.name.replace(/\.[^.]+$/, outputType === "image/jpeg" ? ".jpg" : "");
            const compressedFile = new File([blob], newName, {
              type: outputType,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          }
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      cleanup();
      resolve(file);
    };

    img.src = url;
  });
}

export const uploadApi = {
  async uploadImage(rawFile: File): Promise<{ url: string; publicId?: string }> {
    const file = await compressImage(rawFile);
    const token = localStorage.getItem("ssToursAdminToken");
    const mimeType = resolveMimeType(file);

    const response = await fetch(`${API_URL}/uploads/images`, {
      method: "POST",
      headers: {
        "Content-Type": mimeType,
        "X-File-Name": encodeURIComponent(file.name),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: file
    });

    if (response.status === 413) {
      throw new Error("Image file is too large. Please select a smaller photo or take a lower resolution picture.");
    }

    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.success) {
      throw new Error(body?.message || `Image upload failed (HTTP ${response.status})`);
    }
    return body.data;
  }
};


