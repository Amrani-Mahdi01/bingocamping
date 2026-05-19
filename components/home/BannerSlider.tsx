"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { Mono } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { Banner } from "@/lib/types";

interface BannerSliderProps {
  banners: Banner[];
  intervalMs?: number;
}

export function BannerSlider({ banners, intervalMs = 7000 }: BannerSliderProps) {
  const autoplay = React.useRef(
    Autoplay({ delay: intervalMs, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: false,
      containScroll: false,
    },
    [autoplay.current]
  );

  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const update = () => setSelected(emblaApi.selectedScrollSnap());
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  const scrollTo = React.useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );
  const prev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (banners.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Promotions du moment"
      className="relative bg-cream"
    >
      {/* Embla viewport — overflow-hidden + ref attaches Embla */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y select-none">
          {banners.map((banner, i) => (
            <div
              key={banner.id}
              className="relative min-w-0 flex-[0_0_100%] bg-forest-900"
              role="group"
              aria-roledescription="slide"
              aria-label={`Promotion ${i + 1} sur ${banners.length}`}
            >
              <div className="relative h-[100svh] sm:h-auto sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[24/9]">
                <Image
                  src={banner.image}
                  alt={banner.title ?? "Promotion BINGO"}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="pointer-events-none object-cover"
                  draggable={false}
                />

                {/* Forest scrim */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/55 to-forest-950/20 sm:bg-gradient-to-r sm:from-forest-950/85 sm:via-forest-950/55 sm:to-transparent"
                />

                {/* Copy overlay — only animates the active slide */}
                <div className="pointer-events-none absolute inset-0 flex items-center">
                  <div className="mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-10">
                    <div
                      className={cn(
                        "w-full max-w-2xl py-10 text-cream md:py-12",
                        selected === i &&
                          "animate-in fade-in slide-in-from-bottom-3 duration-500"
                      )}
                    >
                      <Mono className="text-tangerine-300">Édition limitée</Mono>
                      <h1 className="mt-3 max-w-xl font-display text-2xl leading-[1.05] tracking-[-0.02em] sm:mt-4 sm:text-4xl md:text-5xl">
                        {banner.title}
                      </h1>
                      {banner.subtitle ? (
                        <p className="mt-3 max-w-md text-xs leading-relaxed text-cream/85 sm:mt-4 sm:text-base">
                          {banner.subtitle}
                        </p>
                      ) : null}
                      {banner.link && banner.ctaLabel ? (
                        <Link
                          href={banner.link}
                          draggable={false}
                          className="pointer-events-auto mt-5 inline-flex items-center gap-2 rounded-md bg-tangerine-500 px-6 py-3 font-display text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-tangerine-600 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tangerine-300 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-900 sm:mt-6"
                        >
                          {banner.ctaLabel}
                          <ArrowRight className="size-4" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Combined control cluster — bottom-right, sits over the viewport */}
      {banners.length > 1 ? (
        <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex items-center gap-3 sm:bottom-6 sm:right-8 lg:right-12">
          <span className="hidden font-mono text-2xs text-cream/70 tabular-nums sm:inline">
            {String(selected + 1).padStart(2, "0")}
            <span className="mx-1 text-cream/30">/</span>
            {String(banners.length).padStart(2, "0")}
          </span>

          {/* Dots */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Aller à la promotion ${i + 1}`}
                aria-current={i === selected}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === selected
                    ? "w-7 bg-tangerine-400"
                    : "w-3 bg-cream/30 hover:bg-cream/55"
                )}
              />
            ))}
          </div>

          {/* Prev / next */}
          <div className="pointer-events-auto inline-flex overflow-hidden rounded-full border border-cream/25 bg-forest-950/40 backdrop-blur">
            <button
              type="button"
              onClick={prev}
              aria-label="Promotion précédente"
              className="inline-flex size-8 items-center justify-center text-cream/85 transition-colors hover:bg-cream/10"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span aria-hidden="true" className="w-px bg-cream/20" />
            <button
              type="button"
              onClick={next}
              aria-label="Promotion suivante"
              className="inline-flex size-8 items-center justify-center text-cream/85 transition-colors hover:bg-cream/10"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
