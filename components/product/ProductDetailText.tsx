"use client";

import * as React from "react";

import { useLanguage, useT } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

/**
 * Client-side block that renders product title + descriptions in the
 * active locale. The product page is an RSC and can't call `useT()`, so
 * we lift the locale-aware bits into this component.
 *
 * Falls through to French when the Arabic field is empty so partially
 * translated catalogs don't break the page.
 */
export function ProductDetailText({ product }: { product: Product }) {
  const t = useT();
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  const name =
    isRtl && product.nameAr ? product.nameAr : product.name;
  const short =
    isRtl && product.descriptionShortAr
      ? product.descriptionShortAr
      : product.descriptionShort;
  const long =
    isRtl && product.descriptionAr
      ? product.descriptionAr
      : product.description;

  return (
    <>
      <h1
        dir={isRtl ? "rtl" : "ltr"}
        className="mt-2 font-display text-lg font-semibold leading-snug text-ink sm:text-xl md:text-2xl"
      >
        {name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:mt-4">
        <span className="font-mono text-[10px] uppercase text-muted-foreground sm:text-2xs">
          {t("product.skuLabel")} {product.sku}
        </span>
      </div>

      {short ? (
        <p
          dir={isRtl ? "rtl" : "ltr"}
          className={cn(
            "mt-4 text-sm leading-relaxed text-ink/85 sm:text-base",
            isRtl && "text-right"
          )}
        >
          {short}
        </p>
      ) : null}

      {long ? (
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className={cn(
            "prose prose-sm mt-2 max-w-none text-xs leading-relaxed text-muted-foreground",
            "prose-headings:font-sans prose-headings:text-ink",
            "prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-strong:text-ink",
            "[&_ul]:!list-disc [&_ol]:!list-decimal",
            "[&_ul]:!ps-6 [&_ol]:!ps-6",
            "[&_ul]:!list-outside [&_ol]:!list-outside",
            "[&_li>p]:!inline [&_li>p]:!m-0",
            "[&_li]:marker:text-ink",
            "[&_p:empty]:min-h-[1em] [&_p:empty]:before:content-['\\00a0']",
            isRtl && "text-right",
            "sm:mt-3 sm:text-sm"
          )}
          lang={isRtl ? "ar" : "fr"}
          dangerouslySetInnerHTML={{ __html: long }}
        />
      ) : null}
    </>
  );
}
