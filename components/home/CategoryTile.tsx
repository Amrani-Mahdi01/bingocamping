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
  className?: string;
}

/* Category tiles cycle through three quiet panel themes so the grid has
   variation without competing with the products below it. */
const THEMES = [
  { bg: "bg-parchment", art: "text-forest-700", arrow: "text-tangerine-600" },
  { bg: "bg-forest-900", art: "text-cream", arrow: "text-tangerine-300" },
  { bg: "bg-tangerine-50", art: "text-tangerine-700", arrow: "text-tangerine-600" },
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function CategoryTile({
  slug,
  name,
  productCount,
  icon,
  className,
}: CategoryTileProps) {
  // `icon` arg kept for backward compat with adminNav — illustration is
  // chosen via the category slug instead.
  void icon;
  const theme = THEMES[hash(slug) % THEMES.length]!;

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
      <div className="flex items-center justify-between gap-3 border-t border-current/10 px-5 py-4">
        <div className="min-w-0">
          <h3
            className={cn(
              "font-display text-md font-semibold leading-tight",
              theme.bg === "bg-forest-900" ? "text-cream" : "text-ink"
            )}
          >
            {name}
          </h3>
          <Mono
            className={cn(
              theme.bg === "bg-forest-900" ? "text-cream/60" : "text-wood-700"
            )}
          >
            {productCount} produits
          </Mono>
        </div>
        <span
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            theme.bg === "bg-forest-900"
              ? "bg-cream/10 " + theme.arrow
              : "bg-cream " + theme.arrow
          )}
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
