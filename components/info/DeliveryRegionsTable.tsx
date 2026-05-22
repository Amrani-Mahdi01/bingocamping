"use client";

import * as React from "react";

import { Mono } from "@/components/ui/typography";
import { formatDZD } from "@/lib/format";
import { useT } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/dictionary";

interface RegionRow {
  region: "Nord" | "Centre" | "Est" | "Ouest" | "Sud";
  count: number;
  minPrice: number;
  maxPrice: number;
  minDays: number;
  maxDays: number;
}

/**
 * Bilingual region pricing table. Region names + headers + the "jours"
 * suffix all come from the i18n dictionary so the table flips when the
 * language is switched.
 */
export function DeliveryRegionsTable({ rows }: { rows: RegionRow[] }) {
  const t = useT();
  return (
    <div className="overflow-hidden rounded-lg border border-wood-600/15 bg-cream text-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-parchment text-start text-2xs font-mono uppercase tracking-wide text-wood-700">
            <th className="px-4 py-2.5">{t("delivery.table.region")}</th>
            <th className="px-4 py-2.5">{t("delivery.table.wilayas")}</th>
            <th className="px-4 py-2.5">{t("delivery.table.delay")}</th>
            <th className="px-4 py-2.5">{t("delivery.table.fee")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.region}
              className="border-t border-wood-600/10 text-ink"
            >
              <td className="px-4 py-2.5">
                <Mono className="text-wood-700">
                  {t(`delivery.region.${r.region}` as TranslationKey)}
                </Mono>
              </td>
              <td className="px-4 py-2.5">{r.count}</td>
              <td className="px-4 py-2.5">
                {r.minDays === r.maxDays
                  ? `${r.minDays} ${t("delivery.table.days")}`
                  : `${r.minDays}-${r.maxDays} ${t("delivery.table.days")}`}
              </td>
              <td className="px-4 py-2.5 font-mono tabular-nums">
                {r.minPrice === r.maxPrice
                  ? formatDZD(r.minPrice)
                  : `${formatDZD(r.minPrice)} - ${formatDZD(r.maxPrice)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
