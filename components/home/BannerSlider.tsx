"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { TopoLines } from "@/components/decorative/TopoLines";
import { Mono } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { Banner } from "@/lib/types";

interface BannerSliderProps {
  banners: Banner[];
  intervalMs?: number;
}

export function BannerSlider({ banners, intervalMs = 6000 }: BannerSliderProps) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const next = React.useCallback(
    () => setIndex((i) => (i + 1) % banners.length),
    [banners.length]
  );
  const prev = React.useCallback(
    () => setIndex((i) => (i - 1 + banners.length) % banners.length),
    [banners.length]
  );

  React.useEffect(() => {
    if (paused || banners.length <= 1) return;
    const t = setInterval(next, intervalMs);
    return () => clearInterval(t);
  }, [paused, next, intervalMs, banners.length]);

  if (banners.length === 0) return null;
  const active = banners[index]!;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Promotions du moment"
      className="relative overflow-hidden bg-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <TopoLines opacity={0.06} className="opacity-100" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
        {/* Stacked on mobile, two-column on md+. The two columns share a
            common height (md:items-stretch) so the image always fills. */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-10">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl md:order-2 md:aspect-auto md:min-h-[460px]">
            <Image
              key={active.id}
              src={active.image}
              alt={active.title ?? "Promotion BINGO"}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Copy */}
          <div className="flex flex-col justify-center gap-5 md:order-1 md:py-12">
            <Mono className="text-wood-600">Édition limitée</Mono>
            <h2 className="font-display text-2xl leading-[1.1] tracking-[-0.02em] text-ink sm:text-3xl md:text-4xl">
              {active.title}
            </h2>
            {active.subtitle ? (
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                {active.subtitle}
              </p>
            ) : null}
            {active.link && active.ctaLabel ? (
              <div>
                <Link
                  href={active.link}
                  className={cn(
                    buttonVariants({ variant: "primary", size: "lg" })
                  )}
                >
                  {active.ctaLabel}
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        {/* Controls — pinned to the image side on desktop, to the bottom of
            the section on mobile. */}
        {banners.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Promotion précédente"
              className="absolute left-2 top-1/2 hidden -translate-y-1/2 size-10 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm transition-colors hover:bg-cream md:left-4 md:inline-flex"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Promotion suivante"
              className="absolute right-2 top-1/2 hidden -translate-y-1/2 size-10 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm transition-colors hover:bg-cream md:right-4 md:inline-flex"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="mt-6 flex justify-center gap-2 md:absolute md:bottom-5 md:left-1/2 md:mt-0 md:-translate-x-1/2">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Aller à la promotion ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index
                      ? "w-8 bg-forest-700"
                      : "w-4 bg-wood-600/30 hover:bg-wood-600/50"
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
