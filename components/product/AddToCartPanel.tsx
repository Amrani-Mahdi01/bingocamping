"use client";

import * as React from "react";
import { Heart, ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { StockBadge } from "@/components/product/StockBadge";
import { VariantSelector } from "@/components/product/VariantSelector";
import { useCart } from "@/lib/stores/cart";
import { useFavorites } from "@/lib/stores/favorites";
import type { Product } from "@/lib/types";

export function AddToCartPanel({ product }: { product: Product }) {
  const hasVariants = product.variants.length > 0;
  const [variant, setVariant] = React.useState<string | undefined>(
    hasVariants ? product.variants[0]?.value : undefined
  );
  const [qty, setQty] = React.useState(1);

  const addToCart = useCart((s) => s.addItem);
  const toggleFavorite = useFavorites((s) => s.toggle);
  const isFavorite = useFavorites((s) => s.isFavorite(product.id));

  const isOOS = product.stockStatus === "out_of_stock";

  const onAdd = () => {
    if (isOOS) return;
    addToCart(product, { variant, quantity: qty });
    toast.success(
      `${product.name} ajouté au panier`,
      {
        description:
          variant && hasVariants
            ? `Variante : ${variant}, quantité ${qty}`
            : `Quantité : ${qty}`,
      }
    );
  };

  const onCommander = () => {
    const el = document.getElementById("quick-order");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Move focus to the first input once the scroll settles, so mobile users
    // can start typing immediately without an extra tap.
    window.setTimeout(() => {
      const firstField = el.querySelector<HTMLInputElement>(
        'input[name="firstName"]'
      );
      firstField?.focus({ preventScroll: true });
    }, 400);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {hasVariants ? (
        <VariantSelector
          variants={product.variants}
          selected={variant}
          onChange={setVariant}
        />
      ) : null}

      {/* Stock status — expanded */}
      <div className="flex items-center gap-2 rounded-md bg-parchment px-3 py-2.5 text-xs sm:gap-3 sm:px-4 sm:py-3 sm:text-sm">
        <StockBadge status={product.stockStatus} stock={product.stock} />
        <span className="text-muted-foreground">
          {product.stockStatus === "in_stock" &&
            "Expédié sous 48h après confirmation."}
          {product.stockStatus === "low_stock" &&
            `Plus que ${product.stock} en stock — commandez vite.`}
          {product.stockStatus === "out_of_stock" &&
            "Indisponible — recevez une alerte au retour en stock."}
        </span>
      </div>

      {/* Qty + dual CTA — stacked on mobile, inline on sm+ */}
      <div className="space-y-3">
        <QuantityStepper
          value={qty}
          onChange={setQty}
          max={Math.max(1, product.stock)}
          disabled={isOOS}
          className="self-start"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onAdd}
            disabled={isOOS}
            className="h-auto w-full flex-1 px-4 py-3.5 text-base sm:w-auto sm:px-6 sm:py-2.5 sm:text-sm"
          >
            <ShoppingBag className="size-5 sm:size-4" />
            {isOOS ? "Indisponible" : "Ajouter au panier"}
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={onCommander}
            disabled={isOOS}
            className="h-auto w-full flex-1 bg-tangerine-500 px-4 py-3.5 text-base text-cream shadow-sm hover:bg-tangerine-600 active:bg-tangerine-700 sm:w-auto sm:px-6 sm:py-2.5 sm:text-sm"
          >
            <Zap className="size-5 sm:size-4" fill="currentColor" />
            Commander
          </Button>
        </div>
      </div>

      {/* Secondary actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={() => {
            toggleFavorite(product.id);
            toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
          }}
        >
          <Heart
            className="size-4"
            fill={isFavorite ? "currentColor" : "none"}
          />
          {isFavorite ? "Dans vos favoris" : "Ajouter aux favoris"}
        </Button>
      </div>
    </div>
  );
}
