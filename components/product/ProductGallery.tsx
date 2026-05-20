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
  const [canHover, setCanHover] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-cream"
        onMouseMove={
          canHover
            ? (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setZoom({
                  x: ((e.clientX - rect.left) / rect.width) * 100,
                  y: ((e.clientY - rect.top) / rect.height) * 100,
                });
              }
            : undefined
        }
        onMouseLeave={canHover ? () => setZoom(null) : undefined}
        onClick={canHover ? undefined : () => setLightbox(true)}
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
          onClick={(e) => {
            e.stopPropagation();
            setLightbox(true);
          }}
          aria-label="Agrandir l'image"
          className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm hover:bg-cream sm:right-3 sm:top-3 sm:size-9"
        >
          <ZoomIn className="size-3.5 sm:size-4" />
        </button>
      </div>

      {/* Thumbs */}
      {images.length > 1 ? (
        <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Voir l'image ${i + 1}`}
                aria-pressed={i === active}
                className={cn(
                  "relative size-14 shrink-0 overflow-hidden rounded-md border-2 bg-cream sm:size-20",
                  i === active
                    ? "border-forest-700"
                    : "border-wood-600/20 hover:border-wood-600/40"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 56px, 80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Lightbox */}
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[min(1100px,95vw)] border-0 bg-ink/95 p-0 text-cream"
        >
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
