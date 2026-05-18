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
      <div className="relative mx-auto h-[320px] max-w-7xl px-4 sm:h-[420px] sm:px-6 md:h-[480px]">
        <TopoLines opacity={0.06} className="opacity-100" />

        <div className="relative grid h-full grid-cols-1 items-center gap-8 sm:grid-cols-2">
          {/* Image */}
          <div className="relative h-44 overflow-hidden rounded-lg sm:h-full">
            <Image
              src={active.image}
              alt={active.title ?? "Promotion BINGO"}
              fill
              priority={index === 0}
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Copy */}
          <div className="max-w-md">
            <Mono className="text-wood-600">Édition limitée</Mono>
            <h2 className="mt-3 font-display text-2xl leading-tight text-ink sm:text-3xl">
              {active.title}
            </h2>
            {active.subtitle ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {active.subtitle}
              </p>
            ) : null}
            {active.link && active.ctaLabel ? (
              <Link
                href={active.link}
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "mt-6"
                )}
              >
                {active.ctaLabel}
              </Link>
            ) : null}
          </div>
        </div>

        {/* Controls */}
        {banners.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Promotion précédente"
              className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm transition-colors hover:bg-cream sm:left-4"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Promotion suivante"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm transition-colors hover:bg-cream sm:right-4"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
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
