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
 * Renders a product's variants. Three shapes:
 *
 *  - colour-only          → swatch row
 *  - size-only            → pill row
 *  - colour × size matrix → swatch row above, pill row below (filtered to
 *    the chosen colour). Clicking a swatch when no size is selected yet
 *    auto-picks the first in-stock size for that colour.
 *
 * The `selected` value tracked by the parent is the composite picker
 * value the adapter emits (e.g. "Olive" or "Olive / M") — the matrix
 * mode resolves it back into colour + size internally.
 */
export function VariantSelector({
  variants,
  selected,
  onChange,
  className,
}: VariantSelectorProps) {
  if (!variants.length) return null;

  const hasColors = variants.some((v) => !!v.colorName);
  const hasSizes = variants.some((v) => !!v.sizeLabel);

  if (hasColors && hasSizes) {
    return (
      <MatrixSelector
        variants={variants}
        selected={selected}
        onChange={onChange}
        className={className}
      />
    );
  }

  if (hasColors) {
    return (
      <ColorRow
        variants={variants}
        selected={selected}
        onPick={onChange}
        className={className}
      />
    );
  }

  return (
    <SizeRow
      variants={variants}
      selected={selected}
      onPick={onChange}
      className={className}
    />
  );
}

/* ---------- Matrix: colours filter the size row ---------- */

function MatrixSelector({
  variants,
  selected,
  onChange,
  className,
}: {
  variants: ProductVariant[];
  selected: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}) {
  // Unique colours preserving order.
  const colours = React.useMemo(() => {
    const seen = new Set<string>();
    const out: { name: string; hex: string | null }[] = [];
    for (const v of variants) {
      if (!v.colorName || seen.has(v.colorName)) continue;
      seen.add(v.colorName);
      out.push({ name: v.colorName, hex: v.colorHex ?? null });
    }
    return out;
  }, [variants]);

  // Parse the composite selected value back into colour + size.
  const [selColor, selSize] = React.useMemo<[string | null, string | null]>(() => {
    if (!selected) return [null, null];
    const m = variants.find((v) => v.value === selected);
    return [m?.colorName ?? null, m?.sizeLabel ?? null];
  }, [selected, variants]);

  // Sizes available for the chosen colour (or the first colour if none yet).
  const activeColor = selColor ?? colours[0]?.name ?? null;
  const sizes = React.useMemo(
    () =>
      variants.filter((v) => v.colorName === activeColor && v.sizeLabel),
    [variants, activeColor],
  );

  const pickColor = (color: string) => {
    // Try to keep the same size when switching colour if it exists, else
    // auto-pick the first in-stock size, else just the first one.
    const sameSizeRow = selSize
      ? variants.find(
          (v) => v.colorName === color && v.sizeLabel === selSize,
        )
      : null;
    const firstInStock = variants.find(
      (v) => v.colorName === color && v.sizeLabel && v.stock > 0,
    );
    const firstAny = variants.find(
      (v) => v.colorName === color && v.sizeLabel,
    );
    const target = sameSizeRow ?? firstInStock ?? firstAny;
    if (target) onChange(target.value);
  };

  const pickSize = (size: string) => {
    const target = variants.find(
      (v) => v.colorName === activeColor && v.sizeLabel === size,
    );
    if (target) onChange(target.value);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <AxisLabel label="Couleur" current={activeColor ?? undefined} />
        <div
          role="radiogroup"
          aria-label="Couleur"
          className="flex flex-wrap gap-2"
        >
          {colours.map((c) => {
            const isActive = c.name === activeColor;
            // The colour is OOS only when every size under it is OOS.
            const isOos = !variants.some(
              (v) => v.colorName === c.name && v.stock > 0,
            );
            return (
              <SwatchButton
                key={c.name}
                name={c.name}
                hex={c.hex ?? colourNameToHex(c.name)}
                active={isActive}
                oos={isOos}
                onClick={() => pickColor(c.name)}
              />
            );
          })}
        </div>
      </div>

      <div>
        <AxisLabel label="Taille" current={selSize ?? undefined} />
        <div
          role="radiogroup"
          aria-label="Taille"
          className="flex flex-wrap gap-2"
        >
          {sizes.map((v) => {
            const isActive = v.sizeLabel === selSize;
            const isOos = v.stock === 0;
            return (
              <PillButton
                key={v.id}
                label={v.sizeLabel ?? ""}
                active={isActive}
                oos={isOos}
                onClick={() => pickSize(v.sizeLabel ?? "")}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- Single-axis rows ---------- */

function ColorRow({
  variants,
  selected,
  onPick,
  className,
}: {
  variants: ProductVariant[];
  selected: string | undefined;
  onPick: (value: string) => void;
  className?: string;
}) {
  const current = variants.find((v) => v.value === selected)?.colorName ?? null;
  return (
    <div className={className}>
      <AxisLabel label="Couleur" current={current ?? undefined} />
      <div role="radiogroup" aria-label="Couleur" className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <SwatchButton
            key={v.id}
            name={v.colorName ?? v.value}
            hex={v.colorHex ?? colourNameToHex(v.colorName ?? v.value)}
            active={v.value === selected}
            oos={v.stock === 0}
            onClick={() => onPick(v.value)}
          />
        ))}
      </div>
    </div>
  );
}

function SizeRow({
  variants,
  selected,
  onPick,
  className,
}: {
  variants: ProductVariant[];
  selected: string | undefined;
  onPick: (value: string) => void;
  className?: string;
}) {
  const current = variants.find((v) => v.value === selected)?.sizeLabel ?? null;
  return (
    <div className={className}>
      <AxisLabel label="Taille" current={current ?? undefined} />
      <div role="radiogroup" aria-label="Taille" className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <PillButton
            key={v.id}
            label={v.sizeLabel ?? v.value}
            active={v.value === selected}
            oos={v.stock === 0}
            onClick={() => onPick(v.value)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Atoms ---------- */

function AxisLabel({ label, current }: { label: string; current?: string }) {
  return (
    <p className="mb-2 font-mono text-2xs uppercase tracking-wide text-wood-700">
      {label}
      {current ? <span className="ms-1 text-ink">: {current}</span> : null}
    </p>
  );
}

function SwatchButton({
  name,
  hex,
  active,
  oos,
  onClick,
}: {
  name: string;
  hex: string;
  active: boolean;
  oos: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={oos ? `${name} — indisponible` : name}
      title={oos ? `${name} — épuisé` : name}
      disabled={oos}
      onClick={onClick}
      style={{ backgroundColor: hex }}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-full border-2 transition-colors disabled:cursor-not-allowed",
        active
          ? "border-forest-700 ring-2 ring-forest-700/30"
          : oos
            ? "border-red-500/70"
            : "border-wood-600/20 hover:border-wood-600/60"
      )}
    >
      <span className="sr-only">{name}</span>
      {oos ? (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-cream/55"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          >
            <span className="block h-[2px] w-[135%] rotate-45 rounded-full bg-red-500 shadow-[0_0_0_1.5px_rgba(255,255,255,0.85)]" />
          </span>
        </>
      ) : null}
    </button>
  );
}

function PillButton({
  label,
  active,
  oos,
  onClick,
}: {
  label: string;
  active: boolean;
  oos: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={oos ? `${label} — indisponible` : label}
      title={oos ? `${label} — épuisé` : label}
      disabled={oos}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed",
        active
          ? "border-forest-700 bg-forest-100 text-forest-800"
          : oos
            ? "border-red-500/60 bg-cream text-ink/40 line-through"
            : "border-wood-600/30 bg-cream text-ink hover:border-forest-500"
      )}
    >
      <span className="relative z-10">{label}</span>
      {oos ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
        >
          <span className="block h-[2px] w-[110%] rotate-45 rounded-full bg-red-500 shadow-[0_0_0_1.5px_rgba(255,255,255,0.85)]" />
        </span>
      ) : null}
    </button>
  );
}

/* ---------- Fallback colour mapping ---------- */

function colourNameToHex(value: string): string {
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
