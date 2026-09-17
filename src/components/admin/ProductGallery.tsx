'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  mainImage: string;
  mainImageAlt: string;
  additionalImages: string[];
}

export default function ProductGallery({ mainImage, mainImageAlt, additionalImages }: ProductGalleryProps) {
  // Combine main image + additional images
  const allImages = [mainImage, ...additionalImages].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % allImages.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[var(--color-airy-blue)] border border-[var(--color-accent-sky)] shadow-sm group">
        <img
          src={allImages[activeIndex]}
          alt={mainImageAlt}
          className="h-full w-full object-cover transition-all duration-500"
        />

        {/* Nav arrows — only if multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-slate-200 text-slate-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-slate-200 text-slate-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Dot indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-6 bg-[var(--color-primary-blue)]'
                      : 'w-2 bg-white/70'
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails — only if multiple images */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 h-16 w-16 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                i === activeIndex
                  ? 'border-[var(--color-primary-blue)] shadow-md'
                  : 'border-slate-200 opacity-60 hover:opacity-100'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
