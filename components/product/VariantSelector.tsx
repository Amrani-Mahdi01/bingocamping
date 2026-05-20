"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/lib/types";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selected: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Renders a product's variants grouped by axis (Couleur / Taille / Pointure
 * / etc). When the axis name is "Couleur" we render swatches; otherwise we
 * render pill chips. Out-of-stock variants are visibly disabled.
 */
export function VariantSelector({
  variants,
  selected,
  onChange,
  className,
}: VariantSelectorProps) {
  if (!variants.length) return null;
  const groups = groupByAxis(variants);

  return (
    <div className={cn("space-y-4", className)}>
      {Object.entries(groups).map(([axis, list]) => {
        const isColor = /couleur/i.test(axis);
        return (
          <div key={axis}>
            <p className="mb-2 font-mono text-2xs uppercase tracking-wide text-wood-700">
              {axis}
              {selected
                ? `: ${list.find((v) => v.value === selected)?.value ?? ""}`
                : ""}
            </p>
            <div
              role="radiogroup"
              aria-label={axis}
              className="flex flex-wrap gap-2"
            >
              {list.map((v) => {
                const isOos = v.stock === 0;
                const isActive = v.value === selected;
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    aria-label={v.value}
                    disabled={isOos}
                    onClick={() => onChange(v.value)}
                    className={cn(
                      "relative inline-flex items-center justify-center transition-colors disabled:cursor-not-allowed",
                      isColor
                        ? cn(
                            "size-10 rounded-full border-2",
                            isActive
                              ? "border-forest-700 ring-2 ring-forest-700/30"
                              : isOos
                                ? "border-red-500/70"
                                : "border-wood-600/20 hover:border-wood-600/60"
                          )
                        : cn(
                            "rounded-md border px-3 py-1.5 text-xs font-medium",
                            isActive
                              ? "border-forest-700 bg-forest-100 text-forest-800"
                              : isOos
                                ? "border-red-500/60 bg-cream text-ink/40 line-through"
                                : "border-wood-600/30 bg-cream text-ink hover:border-forest-500"
                          )
                    )}
                    style={
                      isColor
                        ? { backgroundColor: colourToHex(v.value) }
                        : undefined
                    }
                    title={
                      isOos ? `${v.value} — épuisé` : `${v.value}`
                    }
                    aria-label={
                      isOos ? `${v.value} — indisponible` : v.value
                    }
                  >
                    {isColor ? (
                      <span className="sr-only">{v.value}</span>
                    ) : (
                      <span className="relative z-10">{v.value}</span>
                    )}
                    {isOos && isColor ? (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-full bg-cream/55"
                      />
                    ) : null}
                    {isOos ? (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                      >
                        <span className="block h-[2px] w-[135%] rotate-45 rounded-full bg-red-500 shadow-[0_0_0_1.5px_rgba(255,255,255,0.85)]" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function groupByAxis(variants: ProductVariant[]) {
  const out: Record<string, ProductVariant[]> = {};
  for (const v of variants) {
    const axis = v.name.includes(" / ") ? "Couleur / Taille" : v.name;
    out[axis] ??= [];
    out[axis].push(v);
  }
  return out;
}

/* Loose colour-name → hex mapping for the swatches. Falls back to wood-300. */
function colourToHex(value: string): string {
  const v = value.toLowerCase();
  if (v.includes("olive")) return "#5c5a33";
  if (v.includes("sable") || v.includes("beige")) return "#d9c6a0";
  if (v.includes("anthracite")) return "#2d2d31";
  if (v.includes("ardoise")) return "#566075";
  if (v.includes("brique")) return "#a3502e";
  if (v.includes("bleu nuit")) return "#1d2a44";
  if (v.includes("vert forêt") || v.includes("vert foret")) return "#215728";
  if (v.includes("noir")) return "#1c1a14";
  if (v.includes("blanc")) return "#faf6ef";
  if (v.includes("rouge")) return "#a93434";
  if (v.includes("bleu")) return "#3b5b8a";
  if (v.includes("vert")) return "#477352";
  if (v.includes("gris")) return "#9b9285";
  return "#d9af86";
}
