"use client";

import * as React from "react";
import {
  CreditCard,
  Headphones,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { useT } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/dictionary";

interface Item {
  icon: LucideIcon;
  labelKey: TranslationKey;
  detailKey: TranslationKey;
}

const ITEMS: Item[] = [
  {
    icon: Truck,
    labelKey: "trust.delivery.label",
    detailKey: "trust.delivery.detail",
  },
  {
    icon: CreditCard,
    labelKey: "trust.payment.label",
    detailKey: "trust.payment.detail",
  },
  {
    icon: ShieldCheck,
    labelKey: "trust.guarantee.label",
    detailKey: "trust.guarantee.detail",
  },
  {
    icon: Headphones,
    labelKey: "trust.support.label",
    detailKey: "trust.support.detail",
  },
];

export function TrustBand() {
  const t = useT();
  return (
    <section
      aria-label={t("trust.aria")}
      className="border-y border-wood-600/10 bg-parchment"
    >
      <div className="mx-auto grid max-w-7xl divide-y divide-wood-600/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {ITEMS.map(({ icon: Icon, labelKey, detailKey }) => (
          <div
            key={labelKey}
            className="flex items-center gap-3 px-4 py-3 sm:flex-col sm:items-start sm:gap-4 sm:px-7 sm:py-8 md:flex-row md:items-center"
          >
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-tangerine-50 text-tangerine-600 sm:size-11">
              <Icon className="size-3.5 sm:size-5" strokeWidth={1.7} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-xs font-semibold text-ink leading-tight sm:text-sm">
                {t(labelKey)}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                {t(detailKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
