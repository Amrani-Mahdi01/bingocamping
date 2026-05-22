"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Scale, ShoppingBag, Star, X } from "lucide-react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import { Body, H1, Mono } from "@/components/ui/typography";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { StockBadge } from "@/components/product/StockBadge";
import { useCart } from "@/lib/stores/cart";
import { useCompare } from "@/lib/stores/compare";
import { routes } from "@/lib/routes";
import { useFormatDZD } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export default function ComparePage() {
  const formatPrice = useFormatDZD();
  const items = useCompare((s) => s.items);
  const remove = useCompare((s) => s.removeItem);
  const clear = useCompare((s) => s.clear);
  const addToCart = useCart((s) => s.addItem);

  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);

  if (!hydrated || items.length < 2) {
    return <EmptyState count={items.length} />;
  }

  // Union of attribute labels across all compared products.
  const attrLabels = Array.from(
    new Set(items.flatMap((p) => p.attributes.map((a) => a.label)))
  );

  // Helper — values for a given attribute across products (string or "—").
  const valuesFor = (label: string) =>
    items.map((p) => p.attributes.find((a) => a.label === label)?.value ?? "—");

  const allEqual = (vals: string[]) =>
    vals.every((v) => v.toLowerCase() === vals[0]?.toLowerCase());

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.home}>Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Comparaison</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Mono className="text-wood-600">Côte à côte</Mono>
          <H1 className="mt-2">Comparaison ({items.length} produits)</H1>
          <Body className="mt-2 text-muted-foreground">
            Cellules surlignées : valeurs différentes entre les produits.
          </Body>
        </div>
        <button
          type="button"
          onClick={() => {
            clear();
            toast.success("Comparaison effacée");
          }}
          className="text-sm text-wood-700 underline-offset-4 hover:underline"
        >
          Tout effacer
        </button>
      </header>

      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-lg border border-wood-600/15 bg-cream md:block">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 w-48 border-r border-wood-600/15 bg-cream px-4 py-4 text-left align-top text-xs uppercase tracking-wide text-wood-700"
              >
                Caractéristique
              </th>
              {items.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className="min-w-[220px] px-4 py-4 align-top"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-square overflow-hidden rounded-md bg-parchment">
                      <Image
                        src={p.images[0]?.url ?? "/api/placeholder/300/300"}
                        alt={p.name}
                        fill
                        sizes="220px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        aria-label={`Retirer ${p.name}`}
                        className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm hover:bg-cream"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <Mono className="text-wood-600">{p.brand.name}</Mono>
                    <Link
                      href={routes.product(p.slug)}
                      className="block font-display text-sm font-semibold text-ink hover:text-forest-700"
                    >
                      {p.name}
                    </Link>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        addToCart(p);
                        toast.success(`${p.name} ajouté au panier`);
                      }}
                      disabled={p.stockStatus === "out_of_stock"}
                      className="w-full"
                    >
                      <ShoppingBag className="size-3.5" />
                      Ajouter
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ComparisonRow
              label="Prix"
              values={items.map((p) => (
                <PriceDisplay
                  key={p.id}
                  price={p.price}
                  oldPrice={p.oldPrice}
                  size="sm"
                />
              ))}
              compare={items.map((p) => String(p.price))}
              allEqual={allEqual}
            />
            <ComparisonRow
              label="Note"
              values={items.map((p) => (
                <span key={p.id} className="inline-flex items-center gap-1.5">
                  <Star className="size-3.5 fill-wood-500 text-wood-500" />
                  {p.rating.toFixed(1)} ({p.reviewCount})
                </span>
              ))}
              compare={items.map((p) => String(Math.round(p.rating)))}
              allEqual={allEqual}
            />
            <ComparisonRow
              label="Disponibilité"
              values={items.map((p) => (
                <StockBadge
                  key={p.id}
                  status={p.stockStatus}
                  stock={p.stock}
                  compact
                />
              ))}
              compare={items.map((p) => p.stockStatus)}
              allEqual={allEqual}
            />
            <ComparisonRow
              label="Catégorie"
              values={items.map((p) => (
                <span key={p.id}>{p.category.name}</span>
              ))}
              compare={items.map((p) => p.category.slug)}
              allEqual={allEqual}
            />
            <SectionRow label="Caractéristiques techniques" colSpan={items.length + 1} />
            {attrLabels.map((label) => {
              const raw = valuesFor(label);
              return (
                <ComparisonRow
                  key={label}
                  label={label}
                  values={raw.map((v, i) => (
                    <span key={i} className="text-ink">
                      {v}
                    </span>
                  ))}
                  compare={raw}
                  allEqual={allEqual}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: per-product accordions */}
      <div className="space-y-3 md:hidden">
        {items.map((p) => (
          <Accordion key={p.id}>
            <AccordionItem value={p.id} className="rounded-lg bg-parchment px-4">
              <AccordionTrigger className="py-4">
                <span className="flex items-center gap-3">
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-cream">
                    <Image
                      src={p.images[0]?.url ?? "/api/placeholder/100/100"}
                      alt={p.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <span className="flex flex-col items-start text-left">
                    <Mono className="text-wood-600">{p.brand.name}</Mono>
                    <span className="font-display text-sm">{p.name}</span>
                    <span className="text-xs text-ember">
                      {formatPrice(p.price)}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-xs">
                  {p.attributes.map((a) => (
                    <li
                      key={a.id}
                      className="flex justify-between gap-3 border-b border-wood-600/10 pb-1.5"
                    >
                      <span className="text-wood-700">{a.label}</span>
                      <span className="text-right text-ink">{a.value}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  className="mt-3 text-xs text-ember underline-offset-4 hover:underline"
                >
                  Retirer de la comparaison
                </button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  values,
  compare,
  allEqual,
}: {
  label: string;
  values: React.ReactNode[];
  compare: string[];
  allEqual: (vals: string[]) => boolean;
}) {
  const differing = !allEqual(compare);
  return (
    <tr className="border-t border-wood-600/10">
      <th
        scope="row"
        className="sticky left-0 bg-cream px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-wood-700"
      >
        {label}
      </th>
      {values.map((v, i) => (
        <td
          key={i}
          className={cn(
            "px-4 py-3 align-top",
            differing ? "bg-wood-100" : "bg-parchment/40"
          )}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}

function SectionRow({ label, colSpan }: { label: string; colSpan: number }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="border-t border-wood-600/15 bg-forest-900 px-4 py-2 text-2xs font-mono uppercase tracking-wide text-cream"
      >
        {label}
      </td>
    </tr>
  );
}

function EmptyState({ count }: { count: number }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <Scale className="size-16 text-wood-400" strokeWidth={1.2} />
      <H1 className="mt-4 text-xl">
        {count === 0
          ? "Aucun produit à comparer pour le moment"
          : "Ajoutez au moins 2 produits à comparer"}
      </H1>
      <Body className="mt-2 max-w-md text-muted-foreground">
        Cliquez sur l&apos;icône comparer (la balance) sur les fiches produit
        pour les ajouter ici.
      </Body>
      <Link
        href={routes.catalog}
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-6")}
      >
        Parcourir le catalogue
      </Link>
    </div>
  );
}
