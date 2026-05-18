"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Mono } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { Banner } from "@/lib/types";

interface BannerSliderProps {
  banners: Banner[];
  intervalMs?: number;
}

export function BannerSlider({ banners, intervalMs = 7000 }: BannerSliderProps) {
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
      className="bg-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-6 sm:px-6 sm:pt-5 sm:pb-8">
        <div className="relative overflow-hidden rounded-2xl bg-forest-900">
          {/* Background image */}
          <div className="relative aspect-[4/5] sm:aspect-[16/10] md:aspect-[16/8]">
            <Image
              key={active.id}
              src={active.image}
              alt={active.title ?? "Promotion BINGO"}
              fill
              priority={index === 0}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            {/* Forest scrim — heavier on mobile so copy stays readable */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/55 to-forest-950/20 sm:bg-gradient-to-r sm:from-forest-950/85 sm:via-forest-950/55 sm:to-transparent"
            />
          </div>

          {/* Copy overlay */}
          <div className="absolute inset-0 flex items-end sm:items-center">
            <div className="w-full max-w-2xl px-6 pb-20 pt-8 text-cream sm:px-10 sm:py-10 md:px-14 md:py-12">
              <Mono className="text-tangerine-300">Édition limitée</Mono>
              <h1 className="mt-3 max-w-xl font-display text-3xl leading-[1.05] tracking-[-0.02em] sm:mt-4 sm:text-4xl md:text-5xl">
                {active.title}
              </h1>
              {active.subtitle ? (
                <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/85 sm:mt-4 sm:text-base">
                  {active.subtitle}
                </p>
              ) : null}
              {active.link && active.ctaLabel ? (
                <Link
                  href={active.link}
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-tangerine-500 px-6 py-3 font-display text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-tangerine-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tangerine-300 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-900 sm:mt-6"
                >
                  {active.ctaLabel}
                  <ArrowRight className="size-4" />
                </Link>
              ) : null}
            </div>
          </div>

          {/* Single combined control cluster — bottom-right */}
          {banners.length > 1 ? (
            <div className="absolute bottom-4 right-4 flex items-center gap-3 sm:bottom-6 sm:right-6">
              <span className="hidden font-mono text-2xs text-cream/70 tabular-nums sm:inline">
                {String(index + 1).padStart(2, "0")}
                <span className="mx-1 text-cream/30">/</span>
                {String(banners.length).padStart(2, "0")}
              </span>

              {/* Dot indicators */}
              <div className="flex items-center gap-1.5">
                {banners.map((b, i) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Aller à la promotion ${i + 1}`}
                    aria-current={i === index}
                    className={cn(
                      "h-1 rounded-full transition-all",
                      i === index
                        ? "w-7 bg-tangerine-400"
                        : "w-3 bg-cream/30 hover:bg-cream/55"
                    )}
                  />
                ))}
              </div>

              {/* Paired prev / next pill */}
              <div className="inline-flex overflow-hidden rounded-full border border-cream/25 bg-forest-950/40 backdrop-blur">
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
        </div>
      </div>
    </section>
  );
}
