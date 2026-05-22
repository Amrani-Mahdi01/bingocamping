"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/stores/cart";
import { useFavorites } from "@/lib/stores/favorites";
import { useFormatDZD, useLanguage, useT } from "@/lib/i18n/LanguageProvider";

import { Mono } from "@/components/ui/typography";
import { CategoryIllustration } from "@/components/product/CategoryIllustration";
import { discountPercent } from "@/lib/format";

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
  const router = useRouter();
  const t = useT();
  const { locale } = useLanguage();
  const formatPrice = useFormatDZD();
  const isRtl = locale === "ar";

  // Locale-aware display strings. Falls through to the FR value when
  // the AR version isn't filled in yet.
  const displayName =
    (isRtl && product.nameAr) ? product.nameAr : product.name;
  const displayCategory =
    (isRtl && product.category.nameAr)
      ? product.category.nameAr
      : product.category.name;

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
    toast.success(
      isFavorite ? t("atc.favRemovedToast") : t("atc.favAddedToast")
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOOS) return;
    addToCart(product);
    toast.success(`${displayName} — ${t("atc.addedToast")}`);
  };

  const handleCommander = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOOS) return;
    router.push(`${routes.product(product.slug)}#quick-order`);
  };

  return (
    <Link
      href={routes.product(product.slug)}
      className={cn(
        "group/card flex flex-col overflow-hidden rounded-xl border border-wood-600/15 bg-cream shadow-sm transition-all hover:-translate-y-0.5 hover:border-wood-600/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500",
        className
      )}
    >
      {/* ───── Image / illustration panel ───── */}
      {(() => {
        const primary = product.images[0];
        return (
      <div
        className={cn(
          "relative aspect-[5/6] overflow-hidden rounded-t-xl",
          // Use a neutral background under the photo; fall back to the
          // themed illustration panel when no photo is available.
          primary ? "bg-zinc-100" : theme.bg
        )}
      >
        {primary ? null : <HorizontalStripes color={theme.stripe} />}

        {/* Top-left badge */}
        <div className="absolute start-3 top-3 z-10">
          {isOOS ? (
            <BadgeChip color="bg-ink/80 text-cream">
              {t("stock.badge.out")}
            </BadgeChip>
          ) : product.isBestSeller ? (
            <BadgeChip color="bg-ink text-cream">
              {t("product.bestSeller")}
            </BadgeChip>
          ) : product.isNew ? (
            <BadgeChip color="bg-tangerine-500 text-cream">
              {t("product.new")}
            </BadgeChip>
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
            hydrated && isFavorite ? t("atc.favOn") : t("atc.favOff")
          }
          className={cn(
            "absolute end-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm transition-colors hover:bg-cream",
            hydrated && isFavorite && "text-ember"
          )}
        >
          <Heart
            className="size-4"
            fill={hydrated && isFavorite ? "currentColor" : "none"}
          />
        </button>

        {/* Real product photo, or fallback illustration. Both get a subtle
            zoom on card hover. */}
        {primary ? (
          <Image
            src={primary.url}
            alt={primary.alt || displayName}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 ease-out group-hover/card:scale-[1.06]"
            unoptimized
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center px-10 py-10 transition-transform duration-300 ease-out group-hover/card:scale-[1.08]",
              theme.art
            )}
          >
            <div className="size-[55%] max-w-[180px]">
              <CategoryIllustration categorySlug={product.category.slug} />
            </div>
          </div>
        )}
      </div>
        );
      })()}

      {/* ───── Body ───── */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          isCompact ? "p-3" : "p-2.5 sm:p-4"
        )}
      >
        {/* Category */}
        <div className="flex items-center gap-2">
          <Mono className="truncate text-wood-700">{displayCategory}</Mono>
        </div>

        {/* Name */}
        <h3
          dir={isRtl ? "rtl" : "ltr"}
          className={cn(
            "mt-1.5 font-display font-semibold text-ink leading-tight",
            isCompact ? "text-sm" : "text-xs sm:text-md"
          )}
          title={displayName}
        >
          <span className="block truncate">{displayName}</span>
        </h3>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2">
          <span
            className={cn(
              "font-display font-semibold tabular-nums text-ink",
              isCompact ? "text-sm" : "text-xs sm:text-md"
            )}
          >
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && product.oldPrice > product.price ? (
            <span className="font-body text-[10px] text-muted-foreground line-through tabular-nums sm:text-2xs">
              {formatPrice(product.oldPrice)}
            </span>
          ) : null}
        </div>

        {/* CTAs */}
        <div className="mt-2.5 flex items-stretch gap-2 sm:mt-3">
          <button
            type="button"
            onClick={handleCommander}
            disabled={isOOS}
            aria-label={
              isOOS
                ? t("product.outOfStock")
                : `${t("product.order")} — ${displayName}`
            }
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-tangerine-500 px-2 py-1.5 font-display text-[10px] font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-tangerine-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:py-2 sm:text-xs",
              isCompact && "py-1.5"
            )}
          >
            <Sparkles className="size-3 sm:size-3.5" />
            {t("product.order")}
          </button>
          {/* Secondary cart-icon button — visible at every breakpoint */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOOS}
            aria-label={t("product.addToCart")}
            className="inline-flex shrink-0 items-center justify-center rounded-md border border-wood-600/25 bg-cream px-2.5 text-wood-700 transition-colors hover:bg-wood-100 hover:text-wood-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3"
          >
            <ShoppingCart className="size-3.5 sm:size-4" />
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

