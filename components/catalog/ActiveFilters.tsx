"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { useFormatDZD, useT } from "@/lib/i18n/LanguageProvider";
import type { Brand, Category } from "@/lib/types";

interface ActiveFiltersProps {
  topCategories: Category[];
  brands: Brand[];
  /** Highest price configured for the slider — used to detect when
      `maxPrice=N` is the default and shouldn't show as an active chip. */
  maxPrice: number;
}

/**
 * Renders the currently-applied filters as removable chips above the
 * product grid. Mutating a chip writes back to the URL so the catalog
 * server component re-fetches the filtered list.
 */
export function ActiveFilters({
  topCategories,
  brands,
  maxPrice,
}: ActiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const t = useT();
  const formatPrice = useFormatDZD();

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];

  const update = (mutate: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(sp.toString());
    mutate(params);
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Category — only when on /catalog with ?category=, since /catalog/[slug]
  // already shows the breadcrumb.
  const categorySlug = sp.get("category");
  if (categorySlug) {
    const cat = topCategories.find((c) => c.slug === categorySlug);
    if (cat) {
      chips.push({
        key: "category",
        label: cat.name,
        onRemove: () => update((p) => p.delete("category")),
      });
    }
  }

  // Brands
  sp.getAll("brand").forEach((slug) => {
    const brand = brands.find((b) => b.slug === slug);
    if (brand) {
      chips.push({
        key: `brand-${slug}`,
        label: brand.name,
        onRemove: () =>
          update((p) => {
            const rest = p.getAll("brand").filter((s) => s !== slug);
            p.delete("brand");
            rest.forEach((s) => p.append("brand", s));
          }),
      });
    }
  });

  // Price range
  const minPrice = Number(sp.get("minPrice") ?? 0);
  const maxP = Number(sp.get("maxPrice") ?? maxPrice);
  if (minPrice > 0 || maxP < maxPrice) {
    chips.push({
      key: "price",
      label: `${formatPrice(minPrice)} — ${formatPrice(maxP)}`,
      onRemove: () =>
        update((p) => {
          p.delete("minPrice");
          p.delete("maxPrice");
        }),
    });
  }

  if (sp.get("inStockOnly") === "true") {
    chips.push({
      key: "inStockOnly",
      label: t("catalog.filters.inStockOnly"),
      onRemove: () => update((p) => p.delete("inStockOnly")),
    });
  }

  if (sp.get("promoOnly") === "true") {
    chips.push({
      key: "promoOnly",
      label: t("catalog.filters.promoOnly"),
      onRemove: () => update((p) => p.delete("promoOnly")),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-2xs uppercase tracking-wide text-wood-700">
        {t("catalog.filters.active")}
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          aria-label={`${t("catalog.filters.removeAriaPrefix")} ${chip.label}`}
          className="group inline-flex items-center gap-1.5 rounded-full border border-tangerine-300 bg-tangerine-50 px-3 py-1 text-xs font-medium text-tangerine-700 transition-colors hover:border-tangerine-500 hover:bg-tangerine-100"
        >
          {chip.label}
          <X className="size-3.5 text-tangerine-600 transition-transform group-hover:rotate-90" />
        </button>
      ))}
      <button
        type="button"
        onClick={() => router.replace(pathname, { scroll: false })}
        className="text-xs text-wood-700 underline-offset-4 hover:text-tangerine-600 hover:underline"
      >
        {t("catalog.filters.clearAll")}
      </button>
    </div>
  );
}
