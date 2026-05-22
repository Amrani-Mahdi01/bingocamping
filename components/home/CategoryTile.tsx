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
  /** Admin-uploaded image (absolute URL). When set, tile renders with the
   *  photo as full-bleed background + dark scrim + caption overlay.
   *  When null, falls back to the previous illustration-style card. */
  image?: string | null;
  /** Reserved for future grouping — currently unused. */
  index?: number;
  className?: string;
}

export function CategoryTile({
  slug,
  name,
  productCount,
  icon,
  image,
  className,
}: CategoryTileProps) {
  // `icon` arg kept for backward compat — illustration falls back to slug.
  void icon;

  if (image) {
    return (
      <Link
        href={routes.category(slug)}
        className={cn(
          "group relative flex aspect-square flex-col justify-end overflow-hidden rounded-xl bg-forest-900 text-cream transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tangerine-500",
          className
        )}
      >
        {/* Background photo (admin-uploaded) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />

        {/* Dark scrim — heavier at the bottom where the caption sits */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/40 to-forest-950/15"
        />

        {/* Caption */}
        <div className="relative flex items-end justify-between gap-2 p-3 sm:p-5">
          <div className="min-w-0">
            <h3 className="font-display text-sm font-semibold leading-tight text-cream sm:text-lg">
              {name}
            </h3>
            <Mono className="mt-1 text-[10px] text-cream/75 sm:text-2xs">
              {productCount} produits
            </Mono>
          </div>
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-cream text-tangerine-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-9">
            <ArrowUpRight className="size-3.5 sm:size-4" />
          </span>
        </div>
      </Link>
    );
  }

  // Fallback — illustration-style card when no admin-uploaded image yet.
  return (
    <Link
      href={routes.category(slug)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-parchment transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tangerine-500",
        className
      )}
    >
      <div className="relative aspect-square px-4 py-4 text-forest-700 sm:px-8 sm:py-8">
        <div className="absolute inset-3 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-[1.08] sm:inset-6">
          <div className="size-3/4 max-w-[80px] sm:max-w-[140px]">
            <CategoryIllustration categorySlug={slug} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-wood-600/10 px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-4">
        <div className="min-w-0">
          <h3 className="font-display text-xs font-semibold leading-tight text-ink sm:text-md">
            {name}
          </h3>
          <Mono className="mt-0.5 text-[10px] text-wood-700 sm:text-2xs">
            {productCount} produits
          </Mono>
        </div>
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-cream text-tangerine-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-8">
          <ArrowUpRight className="size-3 sm:size-4" />
        </span>
      </div>
    </Link>
  );
}
