"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Mono } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { formatDZD } from "@/lib/format";
import { routes } from "@/lib/routes";
import { useLanguage, useT } from "@/lib/i18n/LanguageProvider";
import type { Brand, Category } from "@/lib/types";

interface FilterSidebarProps {
  activeCategory?: string;
  /** Flat list of all categories — parents and children. */
  categories: Category[];
  brands: Brand[];
  /** Soft upper bound for the price slider (DZD). */
  maxPrice: number;
  className?: string;
}

export function FilterSidebar({
  activeCategory,
  categories,
  brands,
  maxPrice,
  className,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const t = useT();
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  /** Pick AR name when in Arabic and it's been filled, fallback to FR. */
  const catName = (c: Category) =>
    (isRtl && c.nameAr) ? c.nameAr : c.name;

  const minP = Number(sp.get("minPrice") ?? 0);
  const maxP = Number(sp.get("maxPrice") ?? maxPrice);
  const inStockOnly = sp.get("inStockOnly") === "true";
  const promoOnly = sp.get("promoOnly") === "true";
  const checkedBrands = new Set(sp.getAll("brand"));

  const [range, setRange] = React.useState<[number, number]>([minP, maxP]);
  const [brandSearch, setBrandSearch] = React.useState("");
  const [showAllBrands, setShowAllBrands] = React.useState(false);

  // Build the category tree once per render.
  const topCategories = React.useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  );
  const childMap = React.useMemo(() => {
    const m = new Map<string, Category[]>();
    categories.forEach((c) => {
      if (!c.parentId) return;
      const list = m.get(c.parentId) ?? [];
      list.push(c);
      m.set(c.parentId, list);
    });
    return m;
  }, [categories]);

  // Track which category groups are expanded. Auto-expand the group that
  // contains the active subcategory (or matches the active category).
  const activeCategoryObj = React.useMemo(
    () => categories.find((c) => c.slug === activeCategory),
    [categories, activeCategory]
  );
  const activeParentId =
    activeCategoryObj?.parentId ??
    (activeCategoryObj && !activeCategoryObj.parentId
      ? activeCategoryObj.id
      : undefined);

  const [expandedCats, setExpandedCats] = React.useState<Set<string>>(
    () => new Set(activeParentId ? [activeParentId] : [])
  );
  React.useEffect(() => {
    if (activeParentId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedCats((prev) => {
        if (prev.has(activeParentId)) return prev;
        const next = new Set(prev);
        next.add(activeParentId);
        return next;
      });
    }
  }, [activeParentId]);

  const toggleCategoryExpansion = (id: string) =>
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Re-sync when URL changes from outside (back/forward navigation).
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
    : filteredBrands.slice(0, 8);

  const activeCount =
    (sp.get("minPrice") ? 1 : 0) +
    (sp.get("maxPrice") ? 1 : 0) +
    checkedBrands.size +
    (inStockOnly ? 1 : 0) +
    (promoOnly ? 1 : 0);

  return (
    <aside
      aria-label="Filtres"
      className={cn(
        "w-full shrink-0 overflow-hidden rounded-xl border border-wood-600/15 bg-cream lg:w-[280px]",
        className
      )}
    >
      <header className="flex items-center justify-between border-b border-wood-600/10 bg-parchment px-5 py-4">
        <span className="font-display text-sm font-semibold text-ink">
          {t("filters.title")}
        </span>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className="inline-flex items-center gap-1 text-xs text-wood-700 underline-offset-4 hover:text-tangerine-600 hover:underline"
          >
            <X className="size-3" />
            {t("filters.clearAll")} ({activeCount})
          </button>
        ) : (
          <Mono className="text-wood-700">{t("filters.none")}</Mono>
        )}
      </header>

      <div className="divide-y divide-wood-600/10">
        {/* Categories */}
        <FilterGroup label={t("filters.categories")}>
          <ul className="space-y-0.5">
            <li>
              <Link
                href={routes.catalog}
                className={cn(
                  "flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  !activeCategory
                    ? "bg-tangerine-50 font-medium text-tangerine-700"
                    : "text-ink/80 hover:bg-parchment"
                )}
              >
                <span>{t("filters.allCategories")}</span>
              </Link>
            </li>
            {topCategories.map((c) => {
              const subs = childMap.get(c.id) ?? [];
              const isExpanded = expandedCats.has(c.id);
              const isActive = activeCategory === c.slug;
              const hasSubs = subs.length > 0;
              return (
                <li key={c.id}>
                  <div className="flex items-center gap-0.5">
                    <Link
                      href={routes.category(c.slug)}
                      className={cn(
                        "flex flex-1 items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-tangerine-50 font-medium text-tangerine-700"
                          : "text-ink/80 hover:bg-parchment"
                      )}
                    >
                      <span className="truncate">{catName(c)}</span>
                      <span className="ml-2 shrink-0 font-mono text-2xs text-wood-700">
                        {c.productCount}
                      </span>
                    </Link>
                    {hasSubs ? (
                      <button
                        type="button"
                        onClick={() => toggleCategoryExpansion(c.id)}
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "Replier" : "Déplier"} ${catName(c)}`}
                        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-wood-700 hover:bg-parchment hover:text-ink"
                      >
                        <ChevronDown
                          className={cn(
                            "size-3.5 transition-transform",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </button>
                    ) : null}
                  </div>
                  {hasSubs && isExpanded ? (
                    <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-wood-600/15 pl-2">
                      {subs.map((sub) => {
                        const isSubActive = activeCategory === sub.slug;
                        return (
                          <li key={sub.id}>
                            <Link
                              href={routes.category(sub.slug)}
                              className={cn(
                                "flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors",
                                isSubActive
                                  ? "bg-tangerine-50 font-medium text-tangerine-700"
                                  : "text-ink/75 hover:bg-parchment"
                              )}
                            >
                              <span className="truncate">{catName(sub)}</span>
                              <span className="ml-2 shrink-0 font-mono text-2xs text-wood-700">
                                {sub.productCount}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </FilterGroup>

        {/* Price */}
        <FilterGroup
          label={t("filters.price")}
          aside={
            <Mono className="text-wood-700">
              {/* No explicit dir — let bidi resolution lay it out so the
                  range reads naturally in the active language: "0 دج —
                  100000 دج" right-to-left in Arabic, "0 DZD — 100000
                  DZD" left-to-right in French. */}
              {formatDZD(range[0])} — {formatDZD(range[1])}
            </Mono>
          }
        >
          {/* px-2 here so the rounded thumbs don't get clipped at the sidebar edge */}
          <div className="px-2 pt-2 pb-1">
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
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <label className="space-y-1">
              <span className="font-mono text-2xs uppercase tracking-wide text-wood-700">
                {t("filters.priceMin")}
              </span>
              <input
                type="number"
                value={range[0]}
                onChange={(e) =>
                  setRange([Number(e.target.value) || 0, range[1]])
                }
                onBlur={() => commitRange(range)}
                className="w-full rounded-md border border-wood-600/20 bg-cream px-2 py-1.5 font-mono text-xs tabular-nums focus:border-tangerine-500 focus:outline-none"
                aria-label={t("filters.priceMinAria")}
              />
            </label>
            <label className="space-y-1">
              <span className="font-mono text-2xs uppercase tracking-wide text-wood-700">
                {t("filters.priceMax")}
              </span>
              <input
                type="number"
                value={range[1]}
                onChange={(e) =>
                  setRange([range[0], Number(e.target.value) || maxPrice])
                }
                onBlur={() => commitRange(range)}
                className="w-full rounded-md border border-wood-600/20 bg-cream px-2 py-1.5 font-mono text-xs tabular-nums focus:border-tangerine-500 focus:outline-none"
                aria-label={t("filters.priceMaxAria")}
              />
            </label>
          </div>
        </FilterGroup>

        {/* Brands */}
        <FilterGroup
          label={t("filters.brands")}
          aside={
            checkedBrands.size > 0 ? (
              <Mono className="text-tangerine-600">
                {checkedBrands.size}{" "}
                {checkedBrands.size > 1
                  ? t("filters.brandsSelected_other")
                  : t("filters.brandsSelected_one")}
              </Mono>
            ) : null
          }
        >
          <Input
            placeholder={t("filters.brandsSearch")}
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="mb-3 h-9 bg-parchment text-xs"
          />
          <ul className="space-y-2">
            {visibleBrands.map((b) => (
              <li key={b.id} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${b.slug}`}
                  checked={checkedBrands.has(b.slug)}
                  onCheckedChange={() => toggleBrand(b.slug)}
                />
                <Label
                  htmlFor={`brand-${b.slug}`}
                  className="flex-1 text-xs font-normal text-ink/90"
                >
                  {b.name}
                </Label>
              </li>
            ))}
          </ul>
          {filteredBrands.length > 8 ? (
            <button
              type="button"
              onClick={() => setShowAllBrands((v) => !v)}
              className="mt-3 text-xs font-medium text-tangerine-600 hover:text-tangerine-700"
            >
              {showAllBrands
                ? t("filters.brandsShowLess")
                : `${t("filters.brandsShowMore")} (${filteredBrands.length - 8})`}
            </button>
          ) : null}
        </FilterGroup>

        {/* Availability */}
        <FilterGroup label={t("filters.availability")}>
          <div className="space-y-2.5">
            <label className="flex items-center gap-2">
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
              <span className="text-xs">{t("filters.inStockOnly")}</span>
            </label>
            <label className="flex items-center gap-2">
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
              <span className="text-xs">{t("filters.promoOnly")}</span>
            </label>
          </div>
        </FilterGroup>

      </div>
    </aside>
  );
}

function FilterGroup({
  label,
  aside,
  children,
}: {
  label: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 py-5">
      <header className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="font-display text-sm font-semibold text-ink">{label}</h3>
        {aside}
      </header>
      {children}
    </section>
  );
}
