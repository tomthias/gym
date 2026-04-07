"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExerciseImageCarouselProps {
  images: string[];
  exerciseName: string;
}

export function ExerciseImageCarousel({
  images,
  exerciseName,
}: ExerciseImageCarouselProps) {
  const [idx, setIdx] = useState(0);

  if (images.length === 0) return null;

  const single = images.length === 1;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-muted">
      <div className="aspect-[4/3] relative">
        <img
          src={images[idx]}
          alt={`${exerciseName} - immagine ${idx + 1}`}
          className="w-full h-full object-contain"
        />

        {!single && (
          <span className="absolute top-2 right-2 text-xs bg-black/50 text-white rounded-full px-2 py-0.5">
            {idx + 1} / {images.length}
          </span>
        )}
      </div>

      {!single && (
        <>
          <button
            type="button"
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
            aria-label="Immagine precedente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
            aria-label="Immagine successiva"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex justify-center gap-1.5 py-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === idx ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                aria-label={`Vai all'immagine ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
