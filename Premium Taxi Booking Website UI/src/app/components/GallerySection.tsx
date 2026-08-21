import { ArrowRight, Camera, Eye, Sparkles, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { businessApi } from "../../api/businessApi";

export function GallerySection() {
  const [selected, setSelected] = useState<{ url: string; alt?: string } | null>(null);
  const {
    data: images = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["gallery"],
    queryFn: businessApi.getGallery
  });

  return (
    <section id="gallery" className="bg-[#F7F9FC] py-16 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 text-[11px] font-extrabold tracking-[.2em] text-[#9a7100]">
              <span className="h-px w-7 bg-[#FFC928]" /> TRAVEL EXPERIENCE &amp; MEMORIES
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#071D49] sm:text-4xl lg:text-5xl">
              Made for the moments you remember.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#64748B] sm:text-base">
              A look at the sacred temple tours, family vacations and smooth outstation journeys we are proud to drive.
            </p>
          </div>

          <a
            href="#book"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-[#071D49] px-6 py-3.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#F9B900] hover:text-[#071D49] active:scale-[0.98] sm:self-auto"
          >
            Plan your next trip <ArrowRight size={15} />
          </a>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-[#E2E8F0]"
              />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-10 rounded-xl border border-[#F4B5B5] bg-[#FFF7F7] p-6 text-sm text-[#B42318]">
            Gallery is temporarily unavailable.
          </p>
        ) : images.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-12 text-center">
            <Camera size={32} className="mx-auto text-[#94A3B8]" />
            <p className="mt-3 text-sm font-bold text-[#071D49]">
              Our journey photo gallery will be available shortly.
            </p>
            <p className="mt-1 text-xs text-[#64748B]">
              Check back soon for trip photos and happy customer moments.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <article
                key={image._id}
                onClick={() => setSelected({ url: image.url, alt: image.alt })}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(7,29,73,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#FFC928] hover:shadow-[0_18px_40px_rgba(7,29,73,0.14)]"
              >
                {/* Image Container with Consistent Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8EDF5]">
                  <img
                    src={image.url}
                    alt={image.alt || `SS Tours customer trip photo ${index + 1}`}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071D49]/85 via-[#071D49]/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Hover Floating Eye Badge */}
                  <div className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#071D49] opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-90">
                    <Eye size={17} />
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F9B900] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#071D49] shadow-sm">
                        <Sparkles size={11} /> Verified Ride
                      </span>
                      <span className="text-[11px] font-medium text-white/85 drop-shadow-sm">Solapur &amp; Outstation</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Preview Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-[#071D49]/92 p-4 backdrop-blur-md transition-opacity"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white hover:text-[#071D49]"
            aria-label="Close image preview"
          >
            <X size={20} />
          </button>

          <div
            className="max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.url}
              alt="SS Tours &amp; Travels Solapur Journey"
              className="max-h-[78vh] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}

