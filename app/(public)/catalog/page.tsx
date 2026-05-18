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
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { CatalogSort } from "@/components/catalog/CatalogSort";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { api } from "@/lib/api/client";
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

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const params = toListParams(sp);
  const [{ items, total, page, totalPages }, allCategories, brands] =
    await Promise.all([
      api.products.list(params),
      api.categories.list(),
      api.brands.list(),
    ]);
  const topCategories = allCategories.filter((c) => !c.parentId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.home}>Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Catalogue</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 mb-8">
        <Mono className="text-wood-600">Boutique</Mono>
        <H1 className="mt-2">Catalogue</H1>
        <Body className="mt-3 max-w-2xl text-muted-foreground">
          Toute notre sélection — testée, choisie, livrée dans toute
          l&apos;Algérie.
        </Body>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          topCategories={topCategories}
          brands={brands}
          maxPrice={100000}
        />

        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-display text-base text-ink">{total}</span>{" "}
              produits trouvés
            </p>
            <CatalogSort />
          </div>

          {items.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-lg bg-parchment px-6 py-16 text-center">
      <PackageOpen className="size-16 text-wood-400" strokeWidth={1.2} />
      <H1 as="p" className="mt-4 text-xl">
        Aucun produit ne correspond
      </H1>
      <Body className="mt-2 max-w-md text-muted-foreground">
        Essayez d&apos;élargir vos filtres ou parcourez l&apos;ensemble du
        catalogue.
      </Body>
      <Link
        href={routes.catalog}
        className={cn(buttonVariants({ variant: "primary" }), "mt-6")}
      >
        Effacer les filtres
      </Link>
    </div>
  );
}
