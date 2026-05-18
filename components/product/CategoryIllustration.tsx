import * as React from "react";
import { cn } from "@/lib/utils";

interface CategoryIllustrationProps {
  /** Top-level category slug. Falls back to a generic compass shape. */
  categorySlug: string;
  /** Tailwind class for stroke / fill (e.g. text-cream, text-forest-900) */
  className?: string;
}

/**
 * Stylised category glyphs for ProductCard panels. Designed as flat 2D
 * silhouettes (single fill colour, no inner detail) so they read as
 * decorative marks rather than spot illustrations.
 */
export function CategoryIllustration({
  categorySlug,
  className,
}: CategoryIllustrationProps) {
  const shape = SHAPES[categorySlug] ?? SHAPES["accessoires"]!;
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <g fill="currentColor">{shape}</g>
    </svg>
  );
}

const SHAPES: Record<string, React.ReactNode> = {
  // Tent — symmetrical pentagon with sloped sides
  "tentes-abris": (
    <path d="M100 38 L48 158 L72 158 L72 138 L100 100 L128 138 L128 158 L152 158 Z" />
  ),
  // Mummy sleeping bag — rounded vertical pill
  "sacs-de-couchage": (
    <path d="M100 42 C 80 42 66 60 66 86 L66 152 C 66 168 80 178 100 178 C 120 178 134 168 134 152 L134 86 C 134 60 120 42 100 42 Z" />
  ),
  // Stove pot — cylinder with handles
  "cuisine-outdoor": (
    <>
      <rect x="56" y="92" width="88" height="62" rx="6" />
      <rect x="44" y="100" width="16" height="6" rx="3" />
      <rect x="140" y="100" width="16" height="6" rx="3" />
      <rect x="64" y="80" width="72" height="14" rx="4" />
    </>
  ),
  // Lantern — bell-shaped top + base
  eclairage: (
    <>
      <path d="M96 44 L104 44 L104 56 L96 56 Z" />
      <path d="M76 60 L124 60 L124 70 L76 70 Z" />
      <path d="M80 76 L120 76 C 132 76 140 96 140 116 L140 144 L60 144 L60 116 C 60 96 68 76 80 76 Z" />
      <rect x="68" y="152" width="64" height="10" rx="3" />
    </>
  ),
  // Backpack — rounded square with top strap & front pocket
  "sacs-a-dos": (
    <>
      <path d="M80 50 L120 50 L120 62 L80 62 Z" />
      <path d="M68 62 L132 62 C 140 62 146 70 146 80 L146 156 C 146 164 140 170 132 170 L68 170 C 60 170 54 164 54 156 L54 80 C 54 70 60 62 68 62 Z" />
      <rect x="76" y="108" width="48" height="34" rx="5" fill="#1c1a14" fillOpacity="0.2" />
    </>
  ),
  // Shirt — flat tee silhouette
  vetements: (
    <path d="M68 56 L86 50 L114 50 L132 56 L154 76 L138 92 L128 84 L128 162 L72 162 L72 84 L62 92 L46 76 Z" />
  ),
  // Hiking shoe — side profile
  chaussures: (
    <>
      <path d="M40 132 L40 150 C 40 156 44 160 50 160 L154 160 C 162 160 168 154 168 146 C 168 138 162 132 154 130 L120 122 L108 88 L84 88 L78 110 L60 116 C 50 120 40 124 40 132 Z" />
    </>
  ),
  // Compass / accessoires fallback — circle with N arrow
  accessoires: (
    <>
      <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M100 50 L114 100 L100 90 L86 100 Z" />
      <path d="M100 150 L86 100 L100 110 L114 100 Z" fillOpacity="0.5" />
    </>
  ),
};
