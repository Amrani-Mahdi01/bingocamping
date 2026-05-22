import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { PackageOpen } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Body, H1, Mono } from "@/components/ui/typography";
import { ActiveFilters } from "@/components/catalog/ActiveFilters";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";
import { CatalogSort } from "@/components/catalog/CatalogSort";
import { CatalogFiltersMobile } from "@/components/catalog/CatalogFiltersMobile";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { T } from "@/components/i18n/T";
import { adaptBrand, adaptCategory, adaptProduct } from "@/lib/api/adapters";
import { brandsPublic } from "@/lib/api/brands.server";
import { listPublicCategories } from "@/lib/api/categories.server";
import { listPublicProducts } from "@/lib/api/products.server";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ProductListParams } from "@/lib/types";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Toute la sélection BINGO — tentes, sacs, vêtements, chaussures et accessoires outdoor. Livraison ZR Express partout en Algérie.",
};

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export function toListParams(
  sp: SearchParams,
  overrides: Partial<ProductListParams> = {}
): ProductListParams {
  const arr = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v : v ? [v] : undefined;
  const num = (v: string | string[] | undefined) =>
    typeof v === "string" && v !== "" ? Number(v) : undefined;
  const str = (v: string | string[] | undefined) =>
    typeof v === "string" && v !== "" ? v : undefined;

  return {
    brand: arr(sp.brand),
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    search: str(sp.search),
    sort: str(sp.sort) as ProductListParams["sort"],
    page: num(sp.page) ?? 1,
    limit: 12,
    inStockOnly: sp.inStockOnly === "true",
    promoOnly: sp.promoOnly === "true",
    minRating: num(sp.minRating),
    ...overrides,
  };
}

const MAX_PRICE = 100000;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const params = toListParams(sp);

  const [productsRes, topCategoriesRaw, brandsRaw] = await Promise.all([
    listPublicProducts({
      q: params.search,
      brand: params.brand?.[0],
      promoOnly: params.promoOnly,
      inStockOnly: params.inStockOnly,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      sort:
        params.sort === "price-asc"
          ? "price-asc"
          : params.sort === "price-desc"
            ? "price-desc"
            : params.sort === "popular"
              ? "bestseller"
              : "new",
      page: params.page,
      perPage: params.limit,
    }),
    listPublicCategories(),
    brandsPublic(),
  ]);

  const items = productsRes.items.map(adaptProduct);
  const total = productsRes.total;
  const page = params.page ?? 1;
  const totalPages = Math.max(1, Math.ceil(total / (params.limit ?? 12)));

  // Flatten the category tree so FilterSidebar can render subs grouped
  // by parent (it expects a flat list with parentId).
  const allCategories = topCategoriesRaw.flatMap((c) =>
    [adaptCategory(c), ...(c.children ?? []).map(adaptCategory)],
  );
  const topCategories = topCategoriesRaw.map(adaptCategory);
  const brands = brandsRaw.map(adaptBrand);
  void topCategories;

  return (
    <>
      {/* ───── Page header — parchment band ───── */}
      <section className="border-b border-wood-600/10 bg-parchment">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={routes.home}>
                  <T k="nav.home" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <T k="catalog.breadcrumb" />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6 max-w-xl">
            <Mono className="text-tangerine-600">
              <T k="catalog.eyebrow" />
            </Mono>
            <H1 className="mt-2 text-3xl sm:text-4xl">
              <T k="catalog.title" />
            </H1>
            <Body className="mt-2 text-muted-foreground">
              <T k="catalog.lead" />
            </Body>
          </div>

          {/* Search bar */}
          <div className="mt-8 max-w-3xl">
            <CatalogSearch total={total} />
          </div>
        </div>
      </section>

      {/* ───── Main content ───── */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          {/* Active filter chips */}
          <ActiveFilters
            topCategories={topCategories}
            brands={brands}
            maxPrice={MAX_PRICE}
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="hidden lg:block">
              <FilterSidebar
                categories={allCategories}
                brands={brands}
                maxPrice={MAX_PRICE}
              />
            </div>

            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <CatalogFiltersMobile
                  categories={allCategories}
                  brands={brands}
                  maxPrice={MAX_PRICE}
                  className="lg:hidden"
                />
                <p className="hidden text-sm text-muted-foreground lg:block">
                  <T k="catalog.showing" />{" "}
                  <span className="font-display text-base text-ink tabular-nums">
                    {items.length}
                  </span>{" "}
                  <T k="catalog.outOf" />{" "}
                  <span className="font-display text-base text-ink tabular-nums">
                    {total}
                  </span>{" "}
                  <T k="catalog.products" />
                </p>
                <CatalogSort />
              </div>

              {items.length === 0 ? (
                <EmptyState />
              ) : (
                <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                  {items.map((p) => (
                    <li key={p.id}>
                      <ProductCard product={p} />
                    </li>
                  ))}
                </ul>
              )}

              <CatalogPagination page={page} totalPages={totalPages} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-wood-600/15 bg-parchment px-6 py-16 text-center">
      <PackageOpen className="size-16 text-wood-400" strokeWidth={1.2} />
      <H1 as="p" className="mt-4 text-xl">
        <T k="catalog.emptyTitle" />
      </H1>
      <Body className="mt-2 max-w-md text-muted-foreground">
        <T k="catalog.emptyLead" />
      </Body>
      <Link
        href={routes.catalog}
        className={cn(buttonVariants({ variant: "primary" }), "mt-6")}
      >
        <T k="catalog.clearFilters" />
      </Link>
    </div>
  );
}
