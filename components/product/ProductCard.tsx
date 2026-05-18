"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Scale } from "lucide-react";
import { toast } from "sonner";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/stores/cart";
import { useCompare, COMPARE_MAX } from "@/lib/stores/compare";
import { useFavorites } from "@/lib/stores/favorites";

import { Mono } from "@/components/ui/typography";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { StockBadge } from "@/components/product/StockBadge";
import { discountPercent } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
  className?: string;
  /** Hide secondary action icons (used inside carousels with tight space). */
  hideActions?: boolean;
}

export function ProductCard({
  product,
  variant = "default",
  className,
  hideActions,
}: ProductCardProps) {
  const addToCart = useCart((s) => s.addItem);
  const addToCompare = useCompare((s) => s.addItem);
  const compareCount = useCompare((s) => s.items.length);
  const isInCompare = useCompare((s) => s.isInCompare(product.id));
  const isFavorite = useFavorites((s) => s.isFavorite(product.id));
  const toggleFavorite = useFavorites((s) => s.toggle);

  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);

  const isCompact = variant === "compact";
  const discount = discountPercent(product.price, product.oldPrice);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    toast.success(
      isFavorite
        ? "Retiré de vos favoris"
        : "Ajouté à vos favoris"
    );
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare) {
      useCompare.getState().removeItem(product.id);
      toast.success("Retiré de la comparaison");
      return;
    }
    if (compareCount >= COMPARE_MAX) {
      toast.error(`Maximum ${COMPARE_MAX} produits en comparaison`);
      return;
    }
    addToCompare(product);
    toast.success("Ajouté à la comparaison");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <Link
      href={routes.product(product.slug)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg bg-parchment shadow-md transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <Image
          src={product.images[0]?.url ?? "/api/placeholder/600/450"}
          alt={product.images[0]?.alt ?? product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />

        {/* Top-left badge */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
          {product.stockStatus === "out_of_stock" ? (
            <span className="rounded-sm bg-ink/70 px-2 py-0.5 text-2xs font-medium uppercase tracking-wide text-cream">
              Rupture
            </span>
          ) : product.isPromo && discount ? (
            <span className="rounded-sm bg-wood-600 px-2 py-0.5 text-2xs font-medium uppercase tracking-wide text-cream">
              -{discount} %
            </span>
          ) : product.isNew ? (
            <span className="rounded-sm bg-forest-700 px-2 py-0.5 text-2xs font-medium uppercase tracking-wide text-cream">
              Nouveau
            </span>
          ) : null}
          {product.isBestSeller ? (
            <span className="rounded-sm bg-wood-100 px-2 py-0.5 text-2xs font-medium uppercase tracking-wide text-wood-800">
              Top vente
            </span>
          ) : null}
        </div>

        {/* Top-right icon actions */}
        {!hideActions ? (
          <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 max-md:opacity-100">
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
                "inline-flex size-8 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm transition-colors hover:bg-cream",
                hydrated && isFavorite && "text-ember"
              )}
            >
              <Heart
                className="size-4"
                fill={hydrated && isFavorite ? "currentColor" : "none"}
              />
            </button>
            <button
              type="button"
              onClick={handleCompare}
              aria-pressed={hydrated && isInCompare}
              aria-label={
                hydrated && isInCompare
                  ? "Retirer de la comparaison"
                  : "Ajouter à la comparaison"
              }
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm transition-colors hover:bg-cream",
                hydrated && isInCompare && "text-forest-700"
              )}
            >
              <Scale className="size-4" />
            </button>
            {product.stockStatus !== "out_of_stock" ? (
              <button
                type="button"
                onClick={handleAddToCart}
                aria-label="Ajouter au panier"
                className="hidden md:inline-flex size-8 items-center justify-center rounded-full bg-forest-700 text-cream shadow-sm transition-colors hover:bg-forest-800"
              >
                +
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {!isCompact ? (
          <Mono className="text-wood-600">{product.category.name}</Mono>
        ) : null}
        <h3 className="font-body text-sm font-semibold leading-tight text-ink line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-wood-700">{product.brand.name}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <PriceDisplay
            price={product.price}
            oldPrice={product.oldPrice}
            size={isCompact ? "sm" : "md"}
          />
          <StockBadge status={product.stockStatus} stock={product.stock} compact />
        </div>
      </div>
    </Link>
  );
}
