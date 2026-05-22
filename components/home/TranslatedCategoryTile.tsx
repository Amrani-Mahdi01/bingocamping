"use client";

import * as React from "react";

import { CategoryTile } from "@/components/home/CategoryTile";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { ApiCategory } from "@/lib/api/categories";

/**
 * Client-side `CategoryTile` wrapper that picks the FR or AR name based on
 * the active locale. Receives the full API row (with both names) and
 * forwards everything else to the underlying CategoryTile.
 */
export function TranslatedCategoryTile({
  category,
  index,
  className,
}: {
  category: ApiCategory;
  index?: number;
  className?: string;
}) {
  const { locale } = useLanguage();
  const name = locale === "ar" ? category.nameAr : category.nameFr;

  return (
    <CategoryTile
      slug={category.slug}
      name={name}
      productCount={category.productCount}
      icon={category.icon}
      image={category.image}
      index={index}
      className={className}
    />
  );
}
