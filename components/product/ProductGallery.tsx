"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/lib/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);
  const [zoom, setZoom] = React.useState<{ x: number; y: number } | null>(null);

  const safe = images.length > 0 ? images : null;
  const current = safe?.[active] ?? null;

  if (!current) {
    return (
      <div className="aspect-square w-full rounded-lg bg-parchment" aria-hidden />
    );
  }

  const next = () => setActive((a) => (a + 1) % images.length);
  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative aspect-square overflow-hidden rounded-lg bg-cream"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setZoom({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <Image
          src={current.url}
          alt={current.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className={cn(
            "object-cover transition-transform duration-200",
            zoom ? "scale-[1.6]" : "scale-100"
          )}
          style={
            zoom
              ? { transformOrigin: `${zoom.x}% ${zoom.y}%` }
              : undefined
          }
        />
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Agrandir l'image"
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm hover:bg-cream"
        >
          <ZoomIn className="size-4" />
        </button>
      </div>

      {/* Thumbs */}
      {images.length > 1 ? (
        <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Voir l'image ${i + 1}`}
                aria-pressed={i === active}
                className={cn(
                  "relative size-20 shrink-0 overflow-hidden rounded-md border-2 bg-cream",
                  i === active
                    ? "border-forest-700"
                    : "border-wood-600/20 hover:border-wood-600/40"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Lightbox */}
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-w-5xl border-0 bg-ink/95 p-0 text-cream">
          <DialogTitle className="sr-only">{productName} — vue agrandie</DialogTitle>
          <div className="relative aspect-square w-full">
            <Image
              src={current.url}
              alt={current.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Image précédente"
                  className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full bg-cream/20 text-cream hover:bg-cream/30"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Image suivante"
                  className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full bg-cream/20 text-cream hover:bg-cream/30"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Fermer"
              className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-cream/20 text-cream hover:bg-cream/30"
            >
              <X className="size-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
