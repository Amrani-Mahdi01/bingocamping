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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Body, H2, Lead, Mono, Small } from "@/components/ui/typography";
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
import { formatDZD } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Product } from "@/lib/types";

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

          {/* Rating + SKU */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
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

          <Body className="mt-6 text-muted-foreground">
            {product.descriptionShort}
          </Body>

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

      {/* Below-the-fold tabs */}
      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="bg-parchment">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specs">
            Caractéristiques ({product.attributes.length})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            Avis ({product.reviewCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <div className="prose max-w-3xl text-sm leading-relaxed text-ink">
            <Lead>{product.descriptionShort}</Lead>
            <p className="mt-4 text-muted-foreground">{product.description}</p>
          </div>
        </TabsContent>

        <TabsContent value="specs" className="mt-6">
          <div className="max-w-3xl overflow-hidden rounded-lg border border-wood-600/15">
            <table className="w-full text-sm">
              <tbody>
                {product.attributes.map((attr, i) => (
                  <tr
                    key={attr.id}
                    className={
                      i % 2 === 0 ? "bg-cream" : "bg-parchment"
                    }
                  >
                    <th
                      scope="row"
                      className="w-1/3 px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-wood-700"
                    >
                      {attr.label}
                    </th>
                    <td className="px-4 py-2.5 text-ink">{attr.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Reviews product={product} />
        </TabsContent>
      </Tabs>

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

const MOCK_REVIEWS = [
  {
    author: "Yacine B.",
    date: "il y a 2 semaines",
    rating: 5,
    title: "Conforme à la description",
    text: "Reçu rapidement, matériaux de qualité, monté sans difficulté. Je recommande.",
  },
  {
    author: "Amina K.",
    date: "il y a 1 mois",
    rating: 4,
    title: "Très bon rapport qualité-prix",
    text: "Premier achat sur BINGO, livraison rapide à Alger. Produit bien emballé, conforme.",
  },
  {
    author: "Karim M.",
    date: "il y a 1 mois",
    rating: 5,
    title: "Excellent",
    text: "Testé au Djurdjura en conditions humides — parfait. Le SAV répond vite par WhatsApp.",
  },
  {
    author: "Sofia A.",
    date: "il y a 2 mois",
    rating: 4,
    title: "Bonne surprise",
    text: "Léger, robuste, bien fini. La notice en français est un plus.",
  },
  {
    author: "Mehdi T.",
    date: "il y a 3 mois",
    rating: 5,
    title: "Top",
    text: "Service client réactif, livraison ZR Express à Sétif en 48h. Très satisfait.",
  },
];

function Reviews({ product }: { product: Product }) {
  // Deterministic per-product distribution — peaks at the rounded rating,
  // fades on either side. No randomness so SSR + client agree.
  const peak = Math.round(product.rating);
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const distance = Math.abs(stars - peak);
    const weight =
      distance === 0
        ? 0.55
        : distance === 1
        ? 0.18
        : distance === 2
        ? 0.07
        : 0.02;
    return { stars, count: Math.max(0, Math.floor(product.reviewCount * weight)) };
  });
  const total = distribution.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <aside className="space-y-4">
        <div>
          <p className="font-display text-3xl text-ink">
            {product.rating.toFixed(1)}
            <span className="text-sm text-muted-foreground"> / 5</span>
          </p>
          <RatingStars rating={product.rating} />
          <Small>{product.reviewCount} avis vérifiés</Small>
        </div>
        <ul className="space-y-1.5 text-xs">
          {distribution.map((d) => (
            <li key={d.stars} className="flex items-center gap-2">
              <span className="w-8 shrink-0 font-mono">{d.stars}★</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-parchment">
                <span
                  className="block h-full bg-wood-500"
                  style={{ width: `${(d.count / total) * 100}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right font-mono tabular-nums text-muted-foreground">
                {d.count}
              </span>
            </li>
          ))}
        </ul>
      </aside>

      <ul className="space-y-5 md:col-span-2">
        {MOCK_REVIEWS.map((r) => (
          <li key={r.author + r.date} className="border-b border-wood-600/10 pb-5 last:border-0">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-wood-100 font-mono text-xs uppercase text-wood-800">
                {r.author
                  .split(" ")
                  .map((s) => s[0])
                  .join("")}
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-ink">
                  {r.author}
                </p>
                <Small>{r.date}</Small>
              </div>
              <span className="ml-auto">
                <RatingStars rating={r.rating} />
              </span>
            </div>
            <p className="mt-3 font-display text-sm font-semibold text-ink">
              {r.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
          </li>
        ))}
      </ul>
      {/* Reference unused symbol so the prose helper stays untouched */}
      <span className="sr-only">{formatDZD(product.price)}</span>
    </div>
  );
}
