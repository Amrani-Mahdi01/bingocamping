import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { H2 } from "@/components/ui/typography";
import { PineDivider } from "@/components/decorative/PineDivider";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import {
  CategoryName,
  ProductName,
} from "@/components/product/ProductBreadcrumbLabels";
import { QuickOrderForm } from "@/components/product/QuickOrderForm";
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
          {/* Single purchase panel — brand, favourite, title, descriptions,
              price, variants, quantity and the full quick-order form all
              live inside here. */}
          <QuickOrderForm product={product} />
        </section>
      </div>

      {/* Related + Also bought — both feed from the same list, so when there
          are no related products we render nothing (no orphan dividers). */}
      {related.length > 0 ? (
        <>
          <PineDivider className="my-10 sm:my-16" />

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

          <PineDivider className="my-10 sm:my-16" />

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
        </>
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

