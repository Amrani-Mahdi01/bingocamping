"use client";

import * as React from "react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Product } from "@/lib/types";

/**
 * Locale-aware labels for the product breadcrumb. Used in two slots:
 *
 *   <BreadcrumbLink href={routes.category(slug)}>
 *     <CategoryName product={product} />
 *   </BreadcrumbLink>
 *
 *   <BreadcrumbPage>
 *     <ProductName product={product} />
 *   </BreadcrumbPage>
 */

export function CategoryName({ product }: { product: Product }) {
  const { locale } = useLanguage();
  const ar = product.category.nameAr;
  const value = locale === "ar" && ar ? ar : product.category.name;
  return <span dir={locale === "ar" ? "rtl" : "ltr"}>{value}</span>;
}

export function ProductName({ product }: { product: Product }) {
  const { locale } = useLanguage();
  const value =
    locale === "ar" && product.nameAr ? product.nameAr : product.name;
  return <span dir={locale === "ar" ? "rtl" : "ltr"}>{value}</span>;
}
