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
  /** Reserved for future grouping — currently unused. */
  index?: number;
  className?: string;
}

export function CategoryTile({
  slug,
  name,
  productCount,
  icon,
  className,
}: CategoryTileProps) {
  // `icon` arg kept for backward compat — illustration is chosen by slug.
  void icon;

  return (
    <Link
      href={routes.category(slug)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-parchment transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tangerine-500",
        className
      )}
    >
      {/* Illustration area — subtle scale on hover for a touch of life */}
      <div className="relative aspect-square px-8 py-8 text-forest-700">
        <div className="absolute inset-6 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-[1.08]">
          <div className="size-3/4 max-w-[140px]">
            <CategoryIllustration categorySlug={slug} />
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="flex items-center justify-between gap-3 border-t border-wood-600/10 px-5 py-4">
        <div className="min-w-0">
          <h3 className="font-display text-md font-semibold leading-tight text-ink">
            {name}
          </h3>
          <Mono className="mt-0.5 text-wood-700">{productCount} produits</Mono>
        </div>
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-cream text-tangerine-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
