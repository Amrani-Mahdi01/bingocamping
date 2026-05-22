"use client";

import * as React from "react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Category } from "@/lib/types";

/**
 * Locale-aware category label. Renders `category.nameAr` when in Arabic
 * and the AR name is filled, otherwise falls back to `category.name`
 * (the French value our adapter populates).
 *
 * Wraps the text in a `<span dir>` so mixed Arabic + Latin inside a
 * breadcrumb item lays out correctly.
 */
export function CategoryLabel({ category }: { category: Category }) {
  const { locale } = useLanguage();
  const value =
    locale === "ar" && category.nameAr ? category.nameAr : category.name;
  return <span dir={locale === "ar" ? "rtl" : "ltr"}>{value}</span>;
}
