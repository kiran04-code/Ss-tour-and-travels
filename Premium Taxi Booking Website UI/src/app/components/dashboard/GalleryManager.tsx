import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Sparkles,
  Trash2,
  UploadCloud,
  X
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { businessApi } from "../../../api/businessApi";
import { uploadApi } from "../../../api/uploadApi";

export function GalleryManager() {
  const client = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [progressText, setProgressText] = useState("");
  const [currentProgress, setCurrentProgress] = useState(0);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: businessApi.getGallery
  });

  const upload = useMutation({
    mutationFn: async () => {
      setError("");
      setSuccessMsg("");
      const total = files.length;
      for (let i = 0; i < total; i++) {
        const file = files[i];
        setProgressText(
          `Uploading ${i + 1} of ${total}: "${file.name}" (Compressing & sending to Cloudinary)...`
        );
        setCurrentProgress(Math.round(((i + 0.5) / total) * 100));

        const uploaded = await uploadApi.uploadImage(file);
        await businessApi.createGalleryImage({
          url: uploaded.url,
          publicId: uploaded.publicId,
          alt: file.name.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "")
        });
        setCurrentProgress(Math.round(((i + 1) / total) * 100));
      }
    },
    onSuccess: () => {
      const count = files.length;
      setFiles([]);
      setError("");
      setProgressText("");
      setCurrentProgress(0);
      setSuccessMsg(`✓ Successfully published ${count} image(s) to the website gallery!`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      void client.invalidateQueries({ queryKey: ["gallery"] });
      setTimeout(() => setSuccessMsg(""), 6000);
    },
    onError: (e: Error) => {
      setProgressText("");
      setCurrentProgress(0);
      setError(e.message || "Failed to upload image. Please try again.");
    }
  });

  const remove = useMutation({
    mutationFn: (id: string) => businessApi.deleteGalleryImage(id),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["gallery"] });
    },
    onError: (e: Error) => setError(e.message || "Failed to delete image.")
  });

  const handleSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccessMsg("");
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeSelectedFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#FFF4CC] text-[#805F00]">
            <ImagePlus size={20} />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-[#071D49] sm:text-lg">
              Gallery Management
            </h2>
            <p className="text-xs text-[#64748B]">
              Upload photos to showcase rides, temple tours &amp; fleet
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-bold text-[#475569]">
          {images.length} Photos Live
        </span>
      </div>

      {/* Upload Drop Zone / Picker */}
      <div className="mt-5">
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/*,.heic,.heif,.jpg,.jpeg,.png,.webp,.avif"
          multiple
          onChange={handleSelectFiles}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center transition hover:border-[#F9B900] hover:bg-[#FFFDF5] active:scale-[0.99]"
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm transition group-hover:scale-110">
            <UploadCloud size={24} className="text-[#F9B900]" />
          </div>
          <p className="mt-3 text-xs font-bold text-[#071D49] sm:text-sm">
            Tap to select photos from your device
          </p>
          <p className="mt-1 text-[11px] text-[#64748B]">
            Supports JPG, PNG, HEIC, WebP up to 50 MB (Auto-compressed for fast loading)
          </p>
        </div>
      </div>

      {/* Selected Previews */}
      {files.length > 0 && (
        <div className="mt-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#071D49]">
              Selected Photos ({files.length})
            </span>
            <button
              type="button"
              onClick={() => setFiles([])}
              className="text-[11px] font-bold text-[#B42318] hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="group relative overflow-hidden rounded-lg border border-[#CBD5E1] bg-white shadow-sm"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-20 w-full object-cover sm:h-24"
                />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedFile(index);
                  }}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-[#B42318] text-white shadow transition hover:scale-110"
                >
                  <X size={12} />
                </button>
                <p className="truncate p-1 text-[10px] font-semibold text-[#475569]">
                  {file.name}
                </p>
              </div>
            ))}
          </div>

          {/* Upload Button & Progress Loader */}
          <div className="mt-4">
            {upload.isPending ? (
              <div className="rounded-lg border border-[#F9B900]/40 bg-[#FFFDF5] p-3.5">
                <div className="flex items-center gap-2.5">
                  <Loader2 size={18} className="animate-spin text-[#F9B900]" />
                  <span className="text-xs font-extrabold text-[#071D49]">
                    {progressText || "Uploading to Cloudinary..."}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-full rounded-full bg-[#F9B900] transition-all duration-300"
                    style={{ width: `${Math.max(15, currentProgress)}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => upload.mutate()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#071D49] px-5 py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#F9B900] hover:text-[#071D49] active:scale-[0.98] sm:w-auto"
              >
                <Sparkles size={15} /> Upload {files.length} Selected Image(s)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Alert Message */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-lg border border-[#F4B5B5] bg-[#FFF7F7] p-3.5 text-xs text-[#B42318]"
        >
          <AlertCircle size={17} className="shrink-0 text-[#B42318] mt-0.5" />
          <div className="flex-1">
            <b className="font-extrabold">Upload Error:</b>
            <p className="mt-0.5 leading-relaxed">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-[#B42318] hover:opacity-70"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Success Alert Message */}
      {successMsg && (
        <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-[#A7E2BA] bg-[#EEF7F1] p-3 text-xs font-bold text-[#26734D]">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Current Live Gallery Grid */}
      <div className="mt-6 border-t border-[#F1F5F9] pt-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Live Gallery Showcase ({images.length})
        </h3>

        {isLoading ? (
          <div className="mt-4 flex items-center justify-center py-10 text-xs text-[#64748B]">
            <Loader2 size={16} className="mr-2 animate-spin text-[#F9B900]" /> Loading gallery images...
          </div>
        ) : images.length === 0 ? (
          <p className="mt-3 text-xs text-[#94A3B8]">
            No photos have been added to the gallery yet.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {images.map((image) => (
              <div
                key={image._id}
                className="group relative overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#F7F9FC]"
              >
                <img
                  src={image.url}
                  alt={image.alt || "Gallery image"}
                  className="h-28 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-32"
                />
                <button
                  type="button"
                  aria-label={`Delete ${image.alt || "image"}`}
                  disabled={remove.isPending}
                  onClick={() => {
                    if (window.confirm("Delete this photo from the website gallery?")) {
                      remove.mutate(image._id);
                    }
                  }}
                  className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-md bg-white/90 text-[#B42318] shadow-sm transition hover:bg-[#B42318] hover:text-white"
                >
                  <Trash2 size={13} />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">
                  {image.alt || "Gallery image"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

