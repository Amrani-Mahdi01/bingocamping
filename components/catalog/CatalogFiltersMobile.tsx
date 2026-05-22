"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/LanguageProvider";
import type { Brand, Category } from "@/lib/types";

interface CatalogFiltersMobileProps {
  activeCategory?: string;
  categories: Category[];
  brands: Brand[];
  maxPrice: number;
  className?: string;
}

/**
 * Mobile/tablet entrypoint for catalog filters.
 *
 * Renders a compact "Filtres" trigger button that opens a Sheet from the
 * left containing the full FilterSidebar. The button shows a count badge
 * for active filters so the user knows at a glance whether the catalog is
 * currently filtered.
 */
export function CatalogFiltersMobile({
  activeCategory,
  categories,
  brands,
  maxPrice,
  className,
}: CatalogFiltersMobileProps) {
  const sp = useSearchParams();
  const t = useT();

  const activeCount = React.useMemo(() => {
    let n = 0;
    if (sp.get("minPrice")) n++;
    if (sp.get("maxPrice")) n++;
    n += sp.getAll("brand").length;
    if (sp.get("inStockOnly") === "true") n++;
    if (sp.get("promoOnly") === "true") n++;
    if (Number(sp.get("minRating") ?? 0) > 0) n++;
    return n;
  }, [sp]);

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full border border-wood-600/25 bg-cream px-4 text-sm font-medium text-ink transition-colors hover:border-wood-600/40 hover:bg-parchment",
          className
        )}
      >
        <SlidersHorizontal className="size-4" />
        {t("filters.mobileLabel")}
        {activeCount > 0 ? (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-tangerine-500 px-1.5 font-mono text-2xs font-semibold text-cream">
            {activeCount}
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full max-w-sm overflow-y-auto bg-cream p-0 sm:max-w-sm"
      >
        <SheetHeader className="border-b border-wood-600/15 px-5 py-4">
          <SheetTitle className="font-display text-base text-ink">
            {t("filters.title")}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {t("filters.title")}
          </SheetDescription>
        </SheetHeader>
        <div className="px-2 py-3">
          <FilterSidebar
            activeCategory={activeCategory}
            categories={categories}
            brands={brands}
            maxPrice={maxPrice}
            className="border-0"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
