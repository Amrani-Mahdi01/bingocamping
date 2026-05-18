"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Mono } from "@/components/ui/typography";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import type { Brand, Category } from "@/lib/types";

interface FilterSidebarProps {
  /** Active top-level category slug, if any (from /catalog/[category] route). */
  activeCategory?: string;
  topCategories: Category[];
  brands: Brand[];
  /** Soft bound for the price slider (DZD). */
  maxPrice: number;
  className?: string;
}

export function FilterSidebar({
  activeCategory,
  topCategories,
  brands,
  maxPrice,
  className,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const minP = Number(sp.get("minPrice") ?? 0);
  const maxP = Number(sp.get("maxPrice") ?? maxPrice);
  const inStockOnly = sp.get("inStockOnly") === "true";
  const promoOnly = sp.get("promoOnly") === "true";
  const minRating = Number(sp.get("minRating") ?? 0);
  const checkedBrands = new Set(sp.getAll("brand"));

  const [range, setRange] = React.useState<[number, number]>([minP, maxP]);
  const [brandSearch, setBrandSearch] = React.useState("");
  const [showAllBrands, setShowAllBrands] = React.useState(false);

  // Sync internal slider state when URL changes from outside (back/forward
  // navigation). Legitimate URL-driven reset — see Catalog notes.
  React.useEffect(() => {
    setRange([minP, maxP]); // eslint-disable-line react-hooks/set-state-in-effect
  }, [minP, maxP]);

  const update = React.useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(sp.toString());
      mutate(params);
      params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, sp]
  );

  const toggleBrand = (slug: string) =>
    update((p) => {
      const current = p.getAll("brand");
      p.delete("brand");
      if (current.includes(slug)) {
        current.filter((b) => b !== slug).forEach((b) => p.append("brand", b));
      } else {
        [...current, slug].forEach((b) => p.append("brand", b));
      }
    });

  const commitRange = (next: [number, number]) =>
    update((p) => {
      if (next[0] > 0) p.set("minPrice", String(next[0]));
      else p.delete("minPrice");
      if (next[1] < maxPrice) p.set("maxPrice", String(next[1]));
      else p.delete("maxPrice");
    });

  const filteredBrands = brands.filter((b) =>
    brandSearch.trim() === ""
      ? true
      : b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );
  const visibleBrands = showAllBrands
    ? filteredBrands
    : filteredBrands.slice(0, 10);

  const activeFilterCount =
    (sp.get("minPrice") ? 1 : 0) +
    (sp.get("maxPrice") ? 1 : 0) +
    checkedBrands.size +
    (inStockOnly ? 1 : 0) +
    (promoOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  return (
    <aside
      aria-label="Filtres"
      className={cn(
        "w-full shrink-0 space-y-6 rounded-lg bg-parchment p-5 lg:w-[280px]",
        className
      )}
    >
      {/* Categories */}
      <FilterGroup label="Catégories">
        <ul className="space-y-1">
          <li>
            <Link
              href={routes.catalog}
              className={cn(
                "block rounded-md px-2 py-1.5 text-sm transition-colors",
                !activeCategory
                  ? "bg-wood-100 font-medium text-wood-800"
                  : "text-ink/80 hover:bg-wood-100/60"
              )}
            >
              Toutes les catégories
            </Link>
          </li>
          {topCategories.map((c) => (
            <li key={c.id}>
              <Link
                href={routes.category(c.slug)}
                className={cn(
                  "flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                  activeCategory === c.slug
                    ? "bg-wood-100 font-medium text-wood-800"
                    : "text-ink/80 hover:bg-wood-100/60"
                )}
              >
                <span>{c.name}</span>
                <Mono className="text-wood-600">{c.productCount}</Mono>
              </Link>
            </li>
          ))}
        </ul>
      </FilterGroup>

      {/* Price */}
      <FilterGroup label="Prix (DZD)">
        <Slider
          value={range}
          min={0}
          max={maxPrice}
          step={500}
          minStepsBetweenValues={1}
          onValueChange={(v) => {
            const arr = Array.isArray(v) ? v : [v];
            setRange([arr[0] ?? 0, arr[1] ?? maxPrice]);
          }}
          onValueCommitted={(v) => {
            const arr = Array.isArray(v) ? v : [v];
            commitRange([arr[0] ?? 0, arr[1] ?? maxPrice]);
          }}
          aria-label="Plage de prix"
          className="mt-2"
        />
        <div className="mt-3 flex items-center gap-2 text-xs">
          <input
            type="number"
            value={range[0]}
            onChange={(e) =>
              setRange([Number(e.target.value) || 0, range[1]])
            }
            onBlur={() => commitRange(range)}
            className="w-full rounded-md border border-wood-600/30 bg-cream px-2 py-1 font-mono tabular-nums"
            aria-label="Prix minimum"
          />
          <span className="text-muted-foreground">—</span>
          <input
            type="number"
            value={range[1]}
            onChange={(e) =>
              setRange([range[0], Number(e.target.value) || maxPrice])
            }
            onBlur={() => commitRange(range)}
            className="w-full rounded-md border border-wood-600/30 bg-cream px-2 py-1 font-mono tabular-nums"
            aria-label="Prix maximum"
          />
        </div>
      </FilterGroup>

      {/* Brands */}
      <FilterGroup label="Marques">
        <Input
          placeholder="Rechercher une marque…"
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          className="mb-2 h-9 bg-cream text-xs"
        />
        <ul className="space-y-1.5">
          {visibleBrands.map((b) => (
            <li key={b.id} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${b.slug}`}
                checked={checkedBrands.has(b.slug)}
                onCheckedChange={() => toggleBrand(b.slug)}
              />
              <Label
                htmlFor={`brand-${b.slug}`}
                className="text-xs font-normal text-ink/90"
              >
                {b.name}
              </Label>
            </li>
          ))}
        </ul>
        {filteredBrands.length > 10 ? (
          <button
            type="button"
            onClick={() => setShowAllBrands((v) => !v)}
            className="mt-2 text-xs font-medium text-wood-700 hover:text-forest-700"
          >
            {showAllBrands ? "Voir moins" : `Voir plus (${filteredBrands.length - 10})`}
          </button>
        ) : null}
      </FilterGroup>

      {/* Availability */}
      <FilterGroup label="Disponibilité">
        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-instock"
            checked={inStockOnly}
            onCheckedChange={(v) =>
              update((p) => {
                if (v) p.set("inStockOnly", "true");
                else p.delete("inStockOnly");
              })
            }
          />
          <Label htmlFor="filter-instock" className="text-xs font-normal">
            En stock uniquement
          </Label>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Checkbox
            id="filter-promo"
            checked={promoOnly}
            onCheckedChange={(v) =>
              update((p) => {
                if (v) p.set("promoOnly", "true");
                else p.delete("promoOnly");
              })
            }
          />
          <Label htmlFor="filter-promo" className="text-xs font-normal">
            Produits en promotion
          </Label>
        </div>
      </FilterGroup>

      {/* Rating */}
      <FilterGroup label="Note minimum">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => {
            const isActive = minRating === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() =>
                  update((p) => {
                    if (isActive) p.delete("minRating");
                    else p.set("minRating", String(n));
                  })
                }
                aria-pressed={isActive}
                aria-label={`Note minimum ${n} étoiles`}
                className={cn(
                  "size-9 rounded-md border text-xs font-medium",
                  isActive
                    ? "border-forest-700 bg-forest-100 text-forest-800"
                    : "border-wood-600/30 bg-cream text-ink hover:border-forest-500"
                )}
              >
                {n}★
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* Clear */}
      {activeFilterCount > 0 ? (
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-full justify-center text-wood-700"
          )}
        >
          <X className="size-4" />
          Effacer les filtres ({activeFilterCount})
        </button>
      ) : null}
    </aside>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 font-display text-sm font-semibold text-ink">
        {label}
      </h3>
      {children}
    </div>
  );
}
