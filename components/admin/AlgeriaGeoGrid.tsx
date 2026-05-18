"use client";

import * as React from "react";
import { Mono, Small } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { wilayas } from "@/lib/mock/wilayas";
import { formatDZD } from "@/lib/format";
import type { WilayaRevenue } from "@/lib/types";

interface Props {
  data: WilayaRevenue[];
  /** Highlight the wilaya hovered/selected, if any. */
  selectedCode?: string;
  onSelect?: (code: string) => void;
}

const REGION_ROWS: Array<{ region: string; codes: string[] }> = [
  { region: "Nord littoral", codes: ["02", "06", "09", "15", "16", "18", "21", "23", "35", "36", "42"] },
  { region: "Hauts plateaux Est", codes: ["04", "05", "19", "25", "34", "40", "41", "43"] },
  { region: "Hauts plateaux Ouest", codes: ["13", "14", "22", "29", "31", "20", "27", "38", "44", "46", "48"] },
  { region: "Centre", codes: ["10", "17", "24", "26", "28"] },
  { region: "Sud-Est", codes: ["07", "12", "30", "39", "55", "57"] },
  { region: "Sud-Ouest", codes: ["03", "08", "32", "45", "47", "51", "52", "58"] },
  { region: "Grand Sud", codes: ["01", "11", "33", "37", "49", "50", "53", "54", "56"] },
];

function colourFor(revenue: number, max: number): string {
  if (max === 0 || revenue === 0) return "#faf6ef";
  const ratio = revenue / max;
  if (ratio < 0.1) return "#e3ebe4"; // forest-100
  if (ratio < 0.25) return "#c7d7c9"; // forest-200
  if (ratio < 0.45) return "#9bb89f"; // forest-300
  if (ratio < 0.65) return "#6a9270"; // forest-400
  if (ratio < 0.85) return "#477352"; // forest-500
  return "#215728"; // forest-700
}

export function AlgeriaGeoGrid({ data, selectedCode, onSelect }: Props) {
  const byCode = React.useMemo(() => {
    const map = new Map<string, WilayaRevenue>();
    data.forEach((d) => map.set(d.wilayaCode, d));
    return map;
  }, [data]);
  const max = Math.max(0, ...data.map((d) => d.revenue));

  return (
    <div className="rounded-lg bg-parchment p-5">
      <div className="flex items-baseline justify-between">
        <Mono className="text-wood-600">Géographie</Mono>
        <Small>{data.filter((d) => d.revenue > 0).length} wilayas actives</Small>
      </div>
      <h2 className="mt-1 font-display text-lg font-semibold">
        Chiffre d&apos;affaires par wilaya
      </h2>

      <div className="mt-5 space-y-3">
        {REGION_ROWS.map((row) => (
          <div key={row.region}>
            <Mono className="text-wood-700">{row.region}</Mono>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {row.codes.map((code) => {
                const w = wilayas.find((x) => x.code === code);
                const r = byCode.get(code);
                const revenue = r?.revenue ?? 0;
                const bg = colourFor(revenue, max);
                const isSelected = selectedCode === code;
                return (
                  <li key={code}>
                    <button
                      type="button"
                      onClick={() => onSelect?.(code)}
                      aria-label={`${w?.name ?? code}, ${formatDZD(revenue)} CA`}
                      style={{
                        backgroundColor: bg,
                        color: revenue / max > 0.5 ? "#faf6ef" : "#1c1a14",
                      }}
                      className={cn(
                        "flex h-14 w-16 flex-col items-start justify-between rounded-md border p-1.5 text-left text-2xs transition-shadow",
                        isSelected
                          ? "border-wood-600 shadow-md"
                          : "border-transparent hover:shadow-sm"
                      )}
                    >
                      <span className="font-mono">{code}</span>
                      <span className="font-mono tabular-nums">
                        {revenue > 0 ? `${Math.round(revenue / 1000)}k` : "—"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-3">
        <Small>Aucune commande</Small>
        <div className="flex h-3 flex-1 max-w-xs overflow-hidden rounded">
          {["#faf6ef", "#e3ebe4", "#c7d7c9", "#9bb89f", "#6a9270", "#477352", "#215728"].map(
            (c) => (
              <span
                key={c}
                className="flex-1"
                style={{ backgroundColor: c }}
              />
            )
          )}
        </div>
        <Small>CA élevé</Small>
      </div>
    </div>
  );
}
