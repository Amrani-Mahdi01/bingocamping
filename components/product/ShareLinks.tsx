"use client";

import * as React from "react";
import { Copy } from "lucide-react";

import {
  FacebookIcon,
  WhatsAppIcon,
} from "@/components/decorative/SocialIcons";
import { useT } from "@/lib/i18n/LanguageProvider";

interface ShareLinksProps {
  productName: string;
}

/**
 * Share row on the product detail page. Lives as a client component so the
 * aria-labels can be translated through useT().
 */
export function ShareLinks({ productName: _productName }: ShareLinksProps) {
  const t = useT();
  return (
    <>
      <a
        href="#"
        aria-label={t("product.share.fb")}
        className="inline-flex size-8 items-center justify-center rounded-md border border-wood-600/20 text-wood-700 hover:text-forest-700 sm:size-9"
      >
        <FacebookIcon />
      </a>
      <a
        href="#"
        aria-label={t("product.share.wa")}
        className="inline-flex size-8 items-center justify-center rounded-md border border-wood-600/20 text-wood-700 hover:text-forest-700 sm:size-9"
      >
        <WhatsAppIcon />
      </a>
      <button
        type="button"
        aria-label={t("product.share.copy")}
        className="inline-flex size-8 items-center justify-center rounded-md border border-wood-600/20 text-wood-700 hover:text-forest-700 sm:size-9"
      >
        <Copy className="size-3.5 sm:size-4" />
      </button>
    </>
  );
}
