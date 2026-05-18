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
      className="relative overflow-hidden bg-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <div className="relative overflow-hidden rounded-2xl bg-forest-900">
          {/* Background image — full bleed inside the rounded frame */}
          <div className="relative aspect-[16/12] sm:aspect-[16/9] md:aspect-[21/9]">
            <Image
              key={active.id}
              src={active.image}
              alt={active.title ?? "Promotion BINGO"}
              fill
              priority={index === 0}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            {/* Forest scrim — left-side gradient so copy sits on a darkened band */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-forest-950/85 via-forest-950/55 to-transparent"
            />
          </div>

          {/* Copy overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-2xl px-6 py-8 text-cream sm:px-10 sm:py-12 md:px-16">
              <Mono className="text-tangerine-300">Édition limitée</Mono>
              <h1 className="mt-4 max-w-xl font-display text-3xl leading-[1.05] tracking-[-0.02em] sm:text-4xl md:text-5xl">
                {active.title}
              </h1>
              {active.subtitle ? (
                <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/85 sm:text-base">
                  {active.subtitle}
                </p>
              ) : null}
              {active.link && active.ctaLabel ? (
                <Link
                  href={active.link}
                  className="mt-7 inline-flex items-center gap-2 rounded-md bg-tangerine-500 px-6 py-3 font-display text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-tangerine-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tangerine-300 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-900"
                >
                  {active.ctaLabel}
                  <ArrowRight className="size-4" />
                </Link>
              ) : null}
            </div>
          </div>

          {/* Slide controls */}
          {banners.length > 1 ? (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Promotion précédente"
                className="absolute left-4 top-1/2 hidden -translate-y-1/2 size-11 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur transition-colors hover:bg-cream/20 md:inline-flex"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Promotion suivante"
                className="absolute right-4 top-1/2 hidden -translate-y-1/2 size-11 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur transition-colors hover:bg-cream/20 md:inline-flex"
              >
                <ChevronRight className="size-5" />
              </button>

              {/* Dot indicators + counter */}
              <div className="absolute bottom-6 right-6 flex items-center gap-3 text-cream/80 sm:bottom-8 sm:right-10">
                <span className="font-mono text-xs tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                  <span className="mx-1 text-cream/40">/</span>
                  {String(banners.length).padStart(2, "0")}
                </span>
                <div className="flex gap-1.5">
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
                          ? "w-8 bg-tangerine-400"
                          : "w-4 bg-cream/30 hover:bg-cream/50"
                      )}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
