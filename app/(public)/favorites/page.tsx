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
import { api } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function FavoritesPage() {
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
    Promise.all(ids.map((id) => api.products.getById(id))).then((all) => {
      if (!cancelled) {
        setProducts(all.filter((p): p is Product => !!p));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [ids, hydrated]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.home}>Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Favoris</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 mb-8">
        <Mono className="text-wood-600">Votre sélection</Mono>
        <H1 className="mt-2">Mes favoris</H1>
        <Body className="mt-2 text-muted-foreground">
          {!hydrated || products === null
            ? " "
            : ids.length === 0
              ? "Aucun favori pour le moment."
              : `${ids.length} produit${ids.length > 1 ? "s" : ""} sauvegardé${
                  ids.length > 1 ? "s" : ""
                }.`}
        </Body>
      </header>

      {!hydrated || products === null ? (
        <p className="rounded-lg bg-parchment px-4 py-12 text-center text-sm text-muted-foreground">
          Chargement…
        </p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center rounded-lg bg-parchment px-6 py-16 text-center">
          <HeartCrack className="size-16 text-wood-400" strokeWidth={1.2} />
          <H1 as="p" className="mt-4 text-xl">
            Vous n&apos;avez aucun favori pour le moment
          </H1>
          <Body className="mt-2 max-w-md text-muted-foreground">
            Cliquez sur le cœur depuis une fiche produit pour le retrouver ici.
          </Body>
          <Link
            href={routes.catalog}
            className={cn(buttonVariants({ variant: "primary" }), "mt-6")}
          >
            Découvrir le catalogue
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
