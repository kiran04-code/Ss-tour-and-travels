import { API_URL } from "./client";

async function compressImage(file: File, maxDimension = 2400, quality = 0.85): Promise<File> {
  // If not an image or is an animated gif or svg, return as-is
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }
  // If file is already small (under 3.5 MB), no need to compress
  if (file.size < 3.5 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
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

      const outputType = file.type === "image/png" ? "image/jpeg" : file.type;
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
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
    img.onerror = () => resolve(file);
    img.src = url;
  });
}

export const uploadApi = {
  async uploadImage(rawFile: File): Promise<{ url: string; publicId?: string }> {
    const file = await compressImage(rawFile);
    const token = localStorage.getItem("ssToursAdminToken");
    const response = await fetch(`${API_URL}/uploads/images`, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
        "X-File-Name": encodeURIComponent(file.name),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: file
    });
    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.success) {
      throw new Error(body?.message || "Image upload failed");
    }
    return body.data;
  }
};

