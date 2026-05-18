import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Mono } from "@/components/ui/typography";
import { CategoryIllustration } from "@/components/product/CategoryIllustration";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

interface CategoryTileProps {
  slug: string;
  name: string;
  productCount: number;
  icon: string;
  /** Position in the parent grid — drives the panel theme so the grid
      distributes themes evenly instead of clumping on a hash. */
  index?: number;
  className?: string;
}

/* Three balanced panel themes. Rotated by index (not hash) so an 8-tile
   grid lands a clean repeating sequence rather than clusters of similar
   panels. */
const THEMES = [
  // Warm cream — deep forest illustration (outdoor / canvas feel)
  {
    bg: "bg-parchment",
    art: "text-forest-700",
    label: "text-ink",
    sub: "text-wood-700",
    arrowBg: "bg-cream",
    arrow: "text-tangerine-600",
    border: "border-wood-600/10",
  },
  // Dark forest — cream illustration (statement panel)
  {
    bg: "bg-forest-900",
    art: "text-cream",
    label: "text-cream",
    sub: "text-cream/60",
    arrowBg: "bg-cream/10",
    arrow: "text-tangerine-300",
    border: "border-cream/10",
  },
  // Soft tangerine — vibrant orange illustration (the accent panel)
  {
    bg: "bg-tangerine-50",
    art: "text-tangerine-500",
    label: "text-ink",
    sub: "text-tangerine-700",
    arrowBg: "bg-cream",
    arrow: "text-tangerine-600",
    border: "border-tangerine-200",
  },
] as const;

export function CategoryTile({
  slug,
  name,
  productCount,
  icon,
  index = 0,
  className,
}: CategoryTileProps) {
  // `icon` kept for backward compat — illustration comes from the slug.
  void icon;
  const theme = THEMES[index % THEMES.length]!;

  return (
    <Link
      href={routes.category(slug)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tangerine-500",
        theme.bg,
        className
      )}
    >
      {/* Illustration area */}
      <div className={cn("relative aspect-square px-8 py-8", theme.art)}>
        <div className="absolute inset-6 flex items-center justify-center">
          <div className="size-3/4 max-w-[140px]">
            <CategoryIllustration categorySlug={slug} />
          </div>
        </div>
      </div>

      {/* Label */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 border-t px-5 py-4",
          theme.border
        )}
      >
        <div className="min-w-0">
          <h3
            className={cn(
              "font-display text-md font-semibold leading-tight",
              theme.label
            )}
          >
            {name}
          </h3>
          <Mono className={cn("mt-0.5", theme.sub)}>
            {productCount} produits
          </Mono>
        </div>
        <span
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            theme.arrowBg,
            theme.arrow
          )}
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
