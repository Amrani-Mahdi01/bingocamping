import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CreditCard, Truck } from "lucide-react";

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
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import {
  CategoryName,
  ProductName,
} from "@/components/product/ProductBreadcrumbLabels";
import { ProductDetailText } from "@/components/product/ProductDetailText";
import { ProductPurchasePanels } from "@/components/product/ProductPurchasePanels";
import { ShareLinks } from "@/components/product/ShareLinks";
import { T } from "@/components/i18n/T";
import { adaptProduct } from "@/lib/api/adapters";
import {
  getPublicProductBySlug,
  listPublicProducts,
} from "@/lib/api/products.server";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const apiProduct = await getPublicProductBySlug(slug);
  if (!apiProduct) return { title: "Produit introuvable / المنتج غير موجود" };
  const product = adaptProduct(apiProduct);
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
  const apiProduct = await getPublicProductBySlug(slug);
  if (!apiProduct) notFound();
  const product = adaptProduct(apiProduct);

  // "Related" = newest others in the same category (excl. this product).
  const relatedRes = await listPublicProducts({
    category: apiProduct.category?.slug,
    sort: "new",
    perPage: 5,
  });
  const related = relatedRes.items
    .filter((p) => p.id !== apiProduct.id)
    .slice(0, 4)
    .map(adaptProduct);

  return (
    <article className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:py-12">
      <Breadcrumb>
        <BreadcrumbList className="text-xs sm:text-sm">
          <BreadcrumbItem className="hidden sm:inline-flex">
            <BreadcrumbLink href={routes.home}>
              <T k="nav.home" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:inline-flex" />
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.catalog}>
              <T k="catalog.breadcrumb" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.category(product.category.slug)}>
              <CategoryName product={product} />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="min-w-0 basis-full sm:basis-auto">
            <BreadcrumbPage className="block break-words whitespace-normal">
              <ProductName product={product} />
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

          {/* Title + SKU + bilingual descriptions, locale-aware. */}
          <ProductDetailText product={product} />

          {/* Price */}
          <div className="mt-4 sm:mt-6">
            <PriceDisplay
              price={product.price}
              oldPrice={product.oldPrice}
              size="lg"
              showSavings
            />
          </div>

          {/* Both purchase panels share variant + quantity state, so the
              choice you make in the upper panel auto-fills the inline
              order form below when you click "Commander". */}
          <ProductPurchasePanels product={product} />

          {/* Share row */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-2xs text-muted-foreground sm:mt-6 sm:gap-3 sm:text-xs">
            <span>
              <T k="product.share" />
            </span>
            <ShareLinks productName={product.name} />
          </div>

          {/* Delivery card */}
          <div className="mt-5 rounded-lg bg-parchment p-3 sm:mt-6 sm:p-4">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <Truck className="mt-0.5 size-4 shrink-0 text-wood-700 sm:size-5" />
              <div>
                <p className="font-display text-xs font-semibold text-ink sm:text-sm">
                  <T k="product.delivery.title" />
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                  <T k="product.delivery.lead" />
                </p>
              </div>
            </div>
            <div className="mt-2.5 flex items-start gap-2.5 sm:mt-3 sm:gap-3">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-wood-700 sm:size-5" />
              <div>
                <p className="font-display text-xs font-semibold text-ink sm:text-sm">
                  <T k="product.payment.title" />
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                  <T k="product.payment.lead" />
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
          <H2>
            <T k="product.relatedTitle" />
          </H2>
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
          <H2>
            <T k="product.alsoBoughtTitle" />
          </H2>
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
          }),
        }}
      />
    </article>
  );
}

