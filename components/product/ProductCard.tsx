"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/stores/cart";
import { useFavorites } from "@/lib/stores/favorites";

import { Mono } from "@/components/ui/typography";
import { CategoryIllustration } from "@/components/product/CategoryIllustration";
import { discountPercent, formatDZD } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  /** `compact` shrinks padding + drops the rating line — used in 6-up carousels. */
  variant?: "default" | "compact";
  className?: string;
}

/* Four illustration-panel themes, picked deterministically by product id. */
const PANEL_THEMES = [
  { bg: "bg-forest-900", art: "text-cream", stripe: "rgba(250,246,239,0.07)" },
  { bg: "bg-ember", art: "text-cream", stripe: "rgba(255,236,210,0.13)" },
  { bg: "bg-wood-200", art: "text-forest-900", stripe: "rgba(28,26,20,0.08)" },
  { bg: "bg-forest-700", art: "text-cream", stripe: "rgba(250,246,239,0.08)" },
] as const;

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function ProductCard({
  product,
  variant = "default",
  className,
}: ProductCardProps) {
  const addToCart = useCart((s) => s.addItem);
  const isFavorite = useFavorites((s) => s.isFavorite(product.id));
  const toggleFavorite = useFavorites((s) => s.toggle);

  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);

  const theme = PANEL_THEMES[hash(product.id) % PANEL_THEMES.length]!;
  const isCompact = variant === "compact";
  const discount = discountPercent(product.price, product.oldPrice);
  const isOOS = product.stockStatus === "out_of_stock";

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    toast.success(isFavorite ? "Retiré de vos favoris" : "Ajouté à vos favoris");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOOS) return;
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <Link
      href={routes.product(product.slug)}
      className={cn(
        "group/card flex flex-col overflow-hidden rounded-xl border border-wood-600/15 bg-cream shadow-sm transition-all hover:-translate-y-0.5 hover:border-wood-600/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500",
        className
      )}
    >
      {/* ───── Coloured illustration panel ───── */}
      <div
        className={cn(
          "relative aspect-[5/6] overflow-hidden rounded-t-xl",
          theme.bg
        )}
      >
        <HorizontalStripes color={theme.stripe} />

        {/* Top-left badge */}
        <div className="absolute left-3 top-3 z-10">
          {isOOS ? (
            <BadgeChip color="bg-ink/80 text-cream">Rupture</BadgeChip>
          ) : product.isBestSeller ? (
            <BadgeChip color="bg-ink text-cream">Best seller</BadgeChip>
          ) : product.isNew ? (
            <BadgeChip color="bg-tangerine-500 text-cream">Nouveau</BadgeChip>
          ) : product.isPromo && discount ? (
            <BadgeChip color="bg-tangerine-500 text-cream">-{discount} %</BadgeChip>
          ) : null}
        </div>

        {/* Top-right heart */}
        <button
          type="button"
          onClick={handleFavorite}
          aria-pressed={hydrated && isFavorite}
          aria-label={
            hydrated && isFavorite
              ? "Retirer des favoris"
              : "Ajouter aux favoris"
          }
          className={cn(
            "absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm transition-colors hover:bg-cream",
            hydrated && isFavorite && "text-ember"
          )}
        >
          <Heart
            className="size-4"
            fill={hydrated && isFavorite ? "currentColor" : "none"}
          />
        </button>

        {/* Centred illustration */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center px-10 py-10",
            theme.art
          )}
        >
          <div className="size-[55%] max-w-[180px]">
            <CategoryIllustration categorySlug={product.category.slug} />
          </div>
        </div>
      </div>

      {/* ───── Body ───── */}
      <div className={cn("flex flex-1 flex-col", isCompact ? "p-3" : "p-4")}>
        {/* Category + rating — review count hidden on mobile so the row
            doesn't squeeze the category into a truncation */}
        <div className="flex items-center justify-between gap-2">
          <Mono className="truncate text-wood-700">{product.category.name}</Mono>
          {!isCompact ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-2xs text-wood-700">
              <Star
                className="size-3 fill-wood-500 text-wood-500"
                aria-hidden="true"
              />
              <span className="tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="hidden text-muted-foreground sm:inline">
                ({product.reviewCount})
              </span>
            </span>
          ) : null}
        </div>

        {/* Name */}
        <h3
          className={cn(
            "mt-1.5 font-display font-semibold text-ink leading-tight",
            isCompact ? "text-sm" : "text-md"
          )}
        >
          <span className="line-clamp-2">{product.name}</span>
        </h3>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={cn(
              "font-display font-semibold tabular-nums text-ink",
              isCompact ? "text-sm" : "text-md"
            )}
          >
            {formatDZD(product.price)}
          </span>
          {product.oldPrice && product.oldPrice > product.price ? (
            <span className="font-body text-2xs text-muted-foreground line-through tabular-nums">
              {formatDZD(product.oldPrice)}
            </span>
          ) : null}
        </div>

        {/* CTAs */}
        <div className="mt-3 flex items-stretch gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOOS}
            aria-label={
              isOOS ? "Indisponible" : `Commander ${product.name}`
            }
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-tangerine-500 px-3 py-2 font-display text-xs font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-tangerine-600 disabled:cursor-not-allowed disabled:opacity-50",
              isCompact && "py-1.5"
            )}
          >
            <Sparkles className="size-3.5" />
            Commander
          </button>
          {/* Secondary cart-icon button — hidden on mobile to keep the
              Commander button full-width within the narrow card */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOOS}
            aria-label="Ajouter au panier"
            className="hidden shrink-0 items-center justify-center rounded-md border border-wood-600/25 bg-cream px-3 text-wood-700 transition-colors hover:bg-wood-100 hover:text-wood-800 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex"
          >
            <ShoppingCart className="size-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}

function BadgeChip({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 font-mono text-2xs font-medium uppercase tracking-wide",
        color
      )}
    >
      {children}
    </span>
  );
}

/* Subtle horizontal "wood-grain" striations behind the illustration.
   Rendered as gently curving stroked paths — gives the panels the
   warm, hand-screened look from the reference design. */
function HorizontalStripes({ color }: { color: string }) {
  // Deterministic vertical positions so the grain looks intentional, not random.
  const ys = [12, 22, 31, 41, 50, 59, 68, 77, 86];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
    >
      <g fill="none" stroke={color} strokeWidth="0.4">
        {ys.map((y, i) => (
          <path
            key={i}
            d={`M -2 ${y} Q ${20 + i * 6} ${y - 1.2} ${50} ${y} T ${102} ${
              y + 0.6
            }`}
          />
        ))}
      </g>
    </svg>
  );
}
