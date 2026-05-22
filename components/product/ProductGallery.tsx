"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/lib/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

/**
 * Product image slider.
 *
 * - Main viewport: Embla carousel with horizontal swipe (touch + drag),
 *   left/right arrows on hover (desktop), dot pagination overlaid.
 * - Thumbnail rail below: clicking a thumb jumps the main slider; the
 *   active thumb is highlighted and auto-scrolled into view.
 * - Top-right ZoomIn button opens a fullscreen lightbox with arrows + close.
 * - RTL-aware: Embla flips direction so swipes feel natural in Arabic.
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  const safe = images.length > 0 ? images : null;
  const [active, setActive] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: images.length > 1,
    align: "start",
    direction: isRtl ? "rtl" : "ltr",
  });

  // Reflect Embla's selected snap into our local state for the dots + thumbs.
  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActive(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  // Locale flip needs Embla to recompute snap positions.
  React.useEffect(() => {
    emblaApi?.reInit({ direction: isRtl ? "rtl" : "ltr" });
  }, [emblaApi, isRtl]);

  const scrollTo = React.useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );
  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Keep the active thumbnail visible in the rail when navigation jumps far.
  const thumbsRef = React.useRef<HTMLUListElement>(null);
  React.useEffect(() => {
    const list = thumbsRef.current;
    if (!list) return;
    const child = list.children[active] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [active]);

  if (!safe) {
    return (
      <div className="aspect-square w-full rounded-lg bg-parchment" aria-hidden />
    );
  }

  return (
    <div className="space-y-3">
      {/* Main slider */}
      <div className="group relative overflow-hidden rounded-lg bg-cream">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex touch-pan-y select-none">
            {safe.map((img, i) => (
              <div
                key={img.id}
                className="relative min-w-0 flex-[0_0_100%]"
                role="group"
                aria-roledescription="slide"
                aria-label={`Image ${i + 1} sur ${safe.length}`}
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={img.url}
                    alt={img.alt || productName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                    unoptimized
                    className="object-cover"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zoom button — opens the lightbox */}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Agrandir l'image"
          className="absolute end-2 top-2 z-10 inline-flex size-8 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm hover:bg-cream sm:end-3 sm:top-3 sm:size-9"
        >
          <ZoomIn className="size-3.5 sm:size-4" />
        </button>

        {/* Arrows — visible on hover (desktop). Mobile users swipe. */}
        {safe.length > 1 ? (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label={isRtl ? "Image suivante" : "Image précédente"}
              className="absolute start-2 top-1/2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-ink opacity-0 shadow-sm transition-opacity hover:bg-cream group-hover:opacity-100 sm:size-10"
            >
              {isRtl ? (
                <ChevronRight className="size-4 sm:size-5" />
              ) : (
                <ChevronLeft className="size-4 sm:size-5" />
              )}
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label={isRtl ? "Image précédente" : "Image suivante"}
              className="absolute end-2 top-1/2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-ink opacity-0 shadow-sm transition-opacity hover:bg-cream group-hover:opacity-100 sm:size-10"
            >
              {isRtl ? (
                <ChevronLeft className="size-4 sm:size-5" />
              ) : (
                <ChevronRight className="size-4 sm:size-5" />
              )}
            </button>

            {/* Dots */}
            <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
              {safe.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`Aller à l'image ${i + 1}`}
                  aria-current={i === active}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === active
                      ? "w-5 bg-ink"
                      : "w-1.5 bg-ink/30 hover:bg-ink/50"
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Thumbnail rail */}
      {safe.length > 1 ? (
        <ul
          ref={thumbsRef}
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {safe.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Voir l'image ${i + 1}`}
                aria-pressed={i === active}
                className={cn(
                  "relative size-14 shrink-0 overflow-hidden rounded-md border-2 bg-cream transition-colors sm:size-20",
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
                  unoptimized
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
          <DialogTitle className="sr-only">
            {productName} — vue agrandie
          </DialogTitle>
          <div className="relative aspect-square w-full">
            <Image
              src={safe[active]!.url}
              alt={safe[active]!.alt}
              fill
              sizes="100vw"
              className="object-contain"
              unoptimized
            />
            {safe.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Image précédente"
                  className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full bg-cream/20 text-cream hover:bg-cream/30"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
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
