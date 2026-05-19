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
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
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
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.category(product.category.slug)}>
              {product.category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images}
          productName={product.name}
        />

        <section>
          <Mono className="text-wood-600">{product.brand.name}</Mono>
          <h1 className="mt-2 font-display text-2xl leading-tight text-ink sm:text-3xl">
            {product.name}
          </h1>

          {/* Description — directly under the title */}
          <p className="mt-4 text-base leading-relaxed text-ink/85">
            {product.descriptionShort}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Rating + SKU */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <RatingStars rating={product.rating} />
            <span className="text-xs text-muted-foreground">
              {product.rating.toFixed(1)} · {product.reviewCount} avis
            </span>
            <span className="font-mono text-2xs uppercase text-muted-foreground">
              SKU {product.sku}
            </span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <PriceDisplay
              price={product.price}
              oldPrice={product.oldPrice}
              size="lg"
              showSavings
            />
          </div>

          <div className="mt-6">
            <AddToCartPanel product={product} />
          </div>

          {/* Share row */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>Partager :</span>
            <a
              href="#"
              aria-label="Partager sur Facebook"
              className="inline-flex size-9 items-center justify-center rounded-md border border-wood-600/20 text-wood-700 hover:text-forest-700"
            >
              <FacebookIcon />
            </a>
            <a
              href="#"
              aria-label="Partager sur WhatsApp"
              className="inline-flex size-9 items-center justify-center rounded-md border border-wood-600/20 text-wood-700 hover:text-forest-700"
            >
              <WhatsAppIcon />
            </a>
            <button
              type="button"
              aria-label="Copier le lien"
              className="inline-flex size-9 items-center justify-center rounded-md border border-wood-600/20 text-wood-700 hover:text-forest-700"
            >
              <Copy className="size-4" />
            </button>
          </div>

          {/* Delivery card */}
          <div className="mt-6 rounded-lg bg-parchment p-4">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 size-5 shrink-0 text-wood-700" />
              <div>
                <p className="font-display text-sm font-semibold text-ink">
                  Livraison ZR Express dans toute l&apos;Algérie
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Délai 48-72h selon la wilaya, frais affichés au checkout.
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <CreditCard className="mt-0.5 size-5 shrink-0 text-wood-700" />
              <div>
                <p className="font-display text-sm font-semibold text-ink">
                  Paiement à la livraison disponible
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Cash, sans frais supplémentaires.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <PineDivider className="my-16" />

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

      <PineDivider className="my-16" />

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

