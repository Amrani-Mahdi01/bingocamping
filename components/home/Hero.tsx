import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Mono } from "@/components/ui/typography";
import { routes } from "@/lib/routes";

/**
 * Static brand-statement hero on a forest-900 panel, layered with subtle
 * horizontal wood-grain striations and stylised mountain silhouettes. No
 * carousel — the promotional banners (managed from /admin/banners) drive
 * the Promotions section further down the page instead.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-forest-900 text-cream">
      <GrainStriations />
      <MountainBackdrop />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 md:py-28 lg:py-32">
        <Mono className="text-tangerine-400">Depuis 2026 · Sétif, DZ</Mono>

        <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.025em] sm:text-5xl md:text-6xl lg:text-7xl">
          Conçu pour le long chemin.
        </h1>

        <p className="mt-6 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg">
          Du matériel honnête pour les nuits du week-end et les longues
          traversées. Testé dans le Djurdjura et l&apos;Atlas, prêt pour
          partout.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={routes.catalog}
            className="inline-flex items-center gap-2 rounded-full bg-tangerine-500 px-7 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cream shadow-sm transition-colors hover:bg-tangerine-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tangerine-300 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-900"
          >
            Voir le catalogue
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href={routes.about}
            className="inline-flex items-center rounded-full border border-cream/30 px-7 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:border-cream/60 hover:bg-cream/5"
          >
            Notre histoire
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-14 max-w-3xl border-t border-cream/15 pt-8 sm:mt-16 sm:pt-10">
          <ul className="grid grid-cols-3 gap-6 sm:gap-12">
            {STATS.map((s) => (
              <li key={s.label}>
                <p className="font-display text-2xl font-semibold leading-none sm:text-3xl md:text-4xl">
                  {s.value}
                </p>
                <Mono className="mt-3 text-cream/60">{s.label}</Mono>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { value: "1 200+", label: "Avis 5 étoiles" },
  { value: "80", label: "Articles testés" },
  { value: "30 jours", label: "Retours offerts" },
] as const;

/* Subtle horizontal silk-screen striations across the whole hero —
   gives the dark panel the same tactile feel as the ProductCard
   illustrated panels. */
function GrainStriations() {
  const ys = Array.from({ length: 22 }, (_, i) => 3 + i * 4.4);
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
    >
      <g fill="none" stroke="#faf6ef" strokeOpacity="0.06" strokeWidth="0.2">
        {ys.map((y, i) => (
          <path
            key={i}
            d={`M -2 ${y} Q ${20 + (i % 4) * 8} ${y - 0.4} ${50} ${y} T ${102} ${
              y + 0.4
            }`}
          />
        ))}
      </g>
    </svg>
  );
}

/* Stylised overlapping mountain silhouettes anchored to the right side.
   Five triangles in graduated cream opacities create the depth without
   any photography. */
function MountainBackdrop() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMaxYMid slice"
      className="absolute inset-y-0 right-0 hidden h-full w-3/4 md:block"
    >
      <g fill="#faf6ef">
        {/* Distant ridges (lower opacity) */}
        <path d="M 600 600 L 880 120 L 1160 600 Z" fillOpacity="0.05" />
        <path d="M 820 600 L 1080 180 L 1340 600 Z" fillOpacity="0.05" />
        {/* Mid ridges */}
        <path d="M 480 600 L 780 240 L 1080 600 Z" fillOpacity="0.07" />
        <path d="M 940 600 L 1200 280 L 1460 600 Z" fillOpacity="0.07" />
        {/* Front ridge */}
        <path d="M 660 600 L 950 320 L 1240 600 Z" fillOpacity="0.1" />
      </g>
    </svg>
  );
}
