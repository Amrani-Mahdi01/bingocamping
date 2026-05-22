"use client";

import * as React from "react";
import Link from "next/link";
import { HeartCrack } from "lucide-react";

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
import { ProductCard } from "@/components/product/ProductCard";
import { useFavorites } from "@/lib/stores/favorites";
import { adaptProduct } from "@/lib/api/adapters";
import { http } from "@/lib/api/http";
import type { ApiProduct } from "@/lib/api/products";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function FavoritesPage() {
  const t = useT();
  const ids = useFavorites((s) => s.items);
  const [products, setProducts] = React.useState<Product[] | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);

  React.useEffect(() => {
    let cancelled = false;
    if (!hydrated) return;
    if (ids.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProducts([]);
      return;
    }
    // Resolve favourite IDs against the live storefront product list.
    // Fetched once, then filtered by id locally.
    http
      .get<{ data: ApiProduct[] }>("/api/products?perPage=500", { auth: "none" })
      .then((res) => {
        if (cancelled) return;
        const map = new Map(res.data.map((p) => [p.id, p]));
        const resolved = ids
          .map((id) => map.get(id))
          .filter((p): p is ApiProduct => !!p)
          .map(adaptProduct);
        setProducts(resolved);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [ids, hydrated]);

  const visibleCount = products?.length ?? 0;
  const countLabel =
    visibleCount === 1
      ? `1 ${t("favorites.countOne")}`
      : `${visibleCount} ${t("favorites.countMany")}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.home}>
              {t("nav.home")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("nav.favorites")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 mb-8">
        <Mono className="text-wood-600">{t("favorites.eyebrow")}</Mono>
        <H1 className="mt-2">{t("favorites.title")}</H1>
        <Body className="mt-2 text-muted-foreground">
          {!hydrated || products === null
            ? " "
            : visibleCount === 0
              ? t("favorites.emptyShort")
              : countLabel}
        </Body>
      </header>

      {!hydrated || products === null ? (
        <p className="rounded-lg bg-parchment px-4 py-12 text-center text-sm text-muted-foreground">
          {t("favorites.loading")}
        </p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center rounded-lg bg-parchment px-6 py-16 text-center">
          <HeartCrack className="size-16 text-wood-400" strokeWidth={1.2} />
          <H1 as="p" className="mt-4 text-xl">
            {t("favorites.empty.title")}
          </H1>
          <Body className="mt-2 max-w-md text-muted-foreground">
            {t("favorites.empty.lead")}
          </Body>
          <Link
            href={routes.catalog}
            className={cn(buttonVariants({ variant: "primary" }), "mt-6")}
          >
            {t("favorites.empty.cta")}
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
