'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface ArticleGalleryProps {
  mainImage?: string | null;
  mainImageAlt?: string | null;
  additionalImages?: string[];
  title: string;
}

export default function ArticleGallery({
  mainImage,
  mainImageAlt,
  additionalImages = [],
  title,
}: ArticleGalleryProps) {
  const allImages = [mainImage, ...additionalImages].filter((img): img is string => Boolean(img));
  const [activeIndex, setActiveIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="relative aspect-video w-full rounded-2xl bg-gradient-to-br from-slate-100 to-[var(--color-airy-blue)] mb-10 overflow-hidden shadow-sm flex items-center justify-center border border-slate-200">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <ImageIcon className="h-8 w-8 text-slate-300" />
          <span className="text-sm font-medium text-slate-500">PT Samudera Inti Medisindo</span>
        </div>
      </div>
    );
  }

  const goNext = () => setActiveIndex((prev) => (prev + 1) % allImages.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="flex flex-col gap-3 mb-10">
      {/* Featured Photo View */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md group border border-slate-100">
        <img
          src={allImages[activeIndex]}
          alt={mainImageAlt || `${title} - Foto ${activeIndex + 1}`}
          className="h-full w-full object-cover transition-all duration-500"
        />

        {/* Navigation arrows (jika ada lebih dari 1 gambar) */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="Gambar sebelumnya"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="Gambar berikutnya"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Indicator dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-full">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Lihat gambar ke-${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Counter Badge */}
        {allImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {activeIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto py-1 px-0.5">
          {allImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 h-16 w-24 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                i === activeIndex
                  ? 'border-[var(--color-primary-blue)] ring-2 ring-[var(--color-primary-blue)]/30 shadow-sm scale-[1.02]'
                  : 'border-slate-200 opacity-60 hover:opacity-100'
              }`}
              aria-label={`Pilih foto ${i + 1}`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
