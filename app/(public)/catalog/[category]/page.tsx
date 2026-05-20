import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { CatalogFiltersMobile } from "@/components/catalog/CatalogFiltersMobile";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";
import { CatalogSort } from "@/components/catalog/CatalogSort";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { api } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { toListParams } from "@/app/(public)/catalog/page";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

const MAX_PRICE = 100000;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await api.categories.get(category);
  if (!cat) return { title: "Catégorie introuvable" };
  return {
    title: cat.name,
    description: `Découvrez la sélection BINGO de ${cat.name.toLowerCase()} — livraison ZR Express partout en Algérie.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ category: categorySlug }, sp] = await Promise.all([
    params,
    searchParams,
  ]);
  const cat = await api.categories.get(categorySlug);
  if (!cat) notFound();

  const listParams = toListParams(sp, { category: categorySlug });
  const [{ items, total, page, totalPages }, allCategories, brands] =
    await Promise.all([
      api.products.list(listParams),
      api.categories.list(),
      api.brands.list(),
    ]);
  const topCategories = allCategories.filter((c) => !c.parentId);
  const parent = cat.parentId
    ? topCategories.find((c) => c.id === cat.parentId)
    : null;
  // Pivot the visible parent: if we're on a sub, show the parent's siblings; if we're on a parent, show our own children.
  const pivotParent = parent ?? cat;
  const siblings = allCategories.filter((c) => c.parentId === pivotParent.id);

  return (
    <>
      {/* Header band */}
      <section className="border-b border-wood-600/10 bg-parchment">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={routes.home}>Accueil</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={routes.catalog}>Catalogue</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {parent ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={routes.category(parent.slug)}>
                      {parent.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              ) : null}
              <BreadcrumbItem>
                <BreadcrumbPage>{cat.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6 max-w-xl">
            <Mono className="text-tangerine-600">
              {parent ? parent.name : "Catalogue"}
            </Mono>
            <H1 className="mt-2 text-3xl sm:text-4xl">{cat.name}</H1>
            <Body className="mt-2 text-muted-foreground">
              {total} produits dans cette catégorie — filtrez et triez à
              votre guise.
            </Body>
          </div>

          {siblings.length > 0 ? (
            <div className="mt-6 -mx-4 hidden overflow-x-auto px-4 sm:mx-0 sm:block sm:px-0">
              <ul className="flex w-max gap-2 sm:flex-wrap sm:w-auto">
                <li>
                  <Link
                    href={routes.category(pivotParent.slug)}
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      cat.id === pivotParent.id
                        ? "border-forest-700 bg-forest-700 text-cream"
                        : "border-wood-600/30 bg-cream text-wood-800 hover:border-forest-500 hover:text-forest-700"
                    )}
                  >
                    Tout
                  </Link>
                </li>
                {siblings.map((sub) => {
                  const isActive = sub.slug === categorySlug;
                  return (
                    <li key={sub.id}>
                      <Link
                        href={routes.category(sub.slug)}
                        className={cn(
                          "inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                          isActive
                            ? "border-forest-700 bg-forest-700 text-cream"
                            : "border-wood-600/30 bg-cream text-wood-800 hover:border-forest-500 hover:text-forest-700"
                        )}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 max-w-3xl">
            <CatalogSearch total={total} />
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <ActiveFilters
            topCategories={topCategories}
            brands={brands}
            maxPrice={MAX_PRICE}
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="hidden lg:block">
              <FilterSidebar
                activeCategory={categorySlug}
                categories={allCategories}
                brands={brands}
                maxPrice={MAX_PRICE}
              />
            </div>

            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <CatalogFiltersMobile
                  activeCategory={categorySlug}
                  categories={allCategories}
                  brands={brands}
                  maxPrice={MAX_PRICE}
                  className="lg:hidden"
                />
                <p className="hidden text-sm text-muted-foreground lg:block">
                  Affichage de{" "}
                  <span className="font-display text-base text-ink tabular-nums">
                    {items.length}
                  </span>{" "}
                  sur{" "}
                  <span className="font-display text-base text-ink tabular-nums">
                    {total}
                  </span>{" "}
                  produits
                </p>
                <CatalogSort />
              </div>

              {items.length === 0 ? (
                <EmptyState categorySlug={categorySlug} />
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

function EmptyState({ categorySlug }: { categorySlug: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-wood-600/15 bg-parchment px-6 py-16 text-center">
      <PackageOpen className="size-16 text-wood-400" strokeWidth={1.2} />
      <H1 as="p" className="mt-4 text-xl">
        Aucun produit ne correspond
      </H1>
      <Body className="mt-2 max-w-md text-muted-foreground">
        Essayez d&apos;élargir vos filtres ou parcourez l&apos;ensemble de la
        catégorie.
      </Body>
      <Link
        href={routes.category(categorySlug)}
        className={cn(buttonVariants({ variant: "primary" }), "mt-6")}
      >
        Effacer les filtres
      </Link>
    </div>
  );
}
