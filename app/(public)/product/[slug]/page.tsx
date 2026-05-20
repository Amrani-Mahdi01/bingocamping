import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Copy,
  CreditCard,
  Star,
  Truck,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { H2, Mono } from "@/components/ui/typography";
import { PineDivider } from "@/components/decorative/PineDivider";
import {
  FacebookIcon,
  WhatsAppIcon,
} from "@/components/decorative/SocialIcons";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { QuickOrderForm } from "@/components/product/QuickOrderForm";
import { api } from "@/lib/api/client";
import { routes } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await api.products.get(slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.descriptionShort,
    openGraph: {
      title: product.name,
      description: product.descriptionShort,
      images: product.images.slice(0, 1).map((i) => i.url),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await api.products.get(slug);
  if (!product) notFound();
  const related = await api.products.getRelated(product.id, 4);

  return (
    <article className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:py-12">
      <Breadcrumb>
        <BreadcrumbList className="text-xs sm:text-sm">
          <BreadcrumbItem className="hidden sm:inline-flex">
            <BreadcrumbLink href={routes.home}>Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:inline-flex" />
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.catalog}>Catalogue</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.category(product.category.slug)}>
              {product.category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="min-w-0 basis-full sm:basis-auto">
            <BreadcrumbPage className="block break-words whitespace-normal">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 grid min-w-0 gap-6 sm:mt-6 sm:gap-8 md:grid-cols-2 md:items-start lg:gap-12">
        <div className="md:sticky md:top-24 md:self-start">
          <ProductGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        <section className="min-w-0">
          <Mono className="text-wood-600">{product.brand.name}</Mono>
          <h1 className="mt-2 font-display text-2xl leading-tight text-ink sm:text-2xl md:text-3xl">
            {product.name}
          </h1>

          {/* Rating + SKU — moved up so it sits right under the title */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:mt-4">
            <RatingStars rating={product.rating} />
            <span className="text-2xs text-muted-foreground sm:text-xs">
              {product.rating.toFixed(1)} · {product.reviewCount} avis
            </span>
            <span className="font-mono text-[10px] uppercase text-muted-foreground sm:text-2xs">
              SKU {product.sku}
            </span>
          </div>

          {/* Description */}
          <p className="mt-4 text-sm leading-relaxed text-ink/85 sm:text-base">
            {product.descriptionShort}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:mt-3 sm:text-sm">
            {product.description}
          </p>

          {/* Price */}
          <div className="mt-4 sm:mt-6">
            <PriceDisplay
              price={product.price}
              oldPrice={product.oldPrice}
              size="lg"
              showSavings
            />
          </div>

          <div className="mt-5 sm:mt-6">
            <AddToCartPanel product={product} />
          </div>

          {/* Quick order form — direct COD without going through cart */}
          <div className="mt-5 sm:mt-6">
            <QuickOrderForm product={product} />
          </div>

          {/* Share row */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-2xs text-muted-foreground sm:mt-6 sm:gap-3 sm:text-xs">
            <span>Partager :</span>
            <a
              href="#"
              aria-label="Partager sur Facebook"
              className="inline-flex size-8 items-center justify-center rounded-md border border-wood-600/20 text-wood-700 hover:text-forest-700 sm:size-9"
            >
              <FacebookIcon />
            </a>
            <a
              href="#"
              aria-label="Partager sur WhatsApp"
              className="inline-flex size-8 items-center justify-center rounded-md border border-wood-600/20 text-wood-700 hover:text-forest-700 sm:size-9"
            >
              <WhatsAppIcon />
            </a>
            <button
              type="button"
              aria-label="Copier le lien"
              className="inline-flex size-8 items-center justify-center rounded-md border border-wood-600/20 text-wood-700 hover:text-forest-700 sm:size-9"
            >
              <Copy className="size-3.5 sm:size-4" />
            </button>
          </div>

          {/* Delivery card */}
          <div className="mt-5 rounded-lg bg-parchment p-3 sm:mt-6 sm:p-4">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <Truck className="mt-0.5 size-4 shrink-0 text-wood-700 sm:size-5" />
              <div>
                <p className="font-display text-xs font-semibold text-ink sm:text-sm">
                  Livraison ZR Express dans toute l&apos;Algérie
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                  Délai 48-72h selon la wilaya, frais affichés au checkout.
                </p>
              </div>
            </div>
            <div className="mt-2.5 flex items-start gap-2.5 sm:mt-3 sm:gap-3">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-wood-700 sm:size-5" />
              <div>
                <p className="font-display text-xs font-semibold text-ink sm:text-sm">
                  Paiement à la livraison disponible
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                  Cash, sans frais supplémentaires.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <PineDivider className="my-10 sm:my-16" />

      {/* Related */}
      {related.length > 0 ? (
        <section>
          <H2>Produits similaires</H2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      <PineDivider className="my-10 sm:my-16" />

      {/* Also bought — slice the related list differently for variety */}
      {related.length > 0 ? (
        <section className="mb-8">
          <H2>Les clients ont aussi acheté</H2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related
              .slice()
              .reverse()
              .map((p) => (
                <ProductCard key={`alt-${p.id}`} product={p} />
              ))}
          </div>
        </section>
      ) : null}

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.descriptionShort,
            image: product.images.map((i) => i.url),
            sku: product.sku,
            brand: { "@type": "Brand", name: product.brand.name },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "DZD",
              availability:
                product.stockStatus === "out_of_stock"
                  ? "https://schema.org/OutOfStock"
                  : "https://schema.org/InStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            },
          }),
        }}
      />
    </article>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating}/5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={
            n <= Math.round(rating)
              ? "size-4 fill-wood-500 text-wood-500"
              : "size-4 fill-transparent text-wood-300"
          }
        />
      ))}
    </div>
  );
}

