"use client";

import * as React from "react";
import { Heart, ShoppingBag } from "lucide-react";
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

  return (
    <div className="space-y-6">
      {hasVariants ? (
        <VariantSelector
          variants={product.variants}
          selected={variant}
          onChange={setVariant}
        />
      ) : null}

      {/* Stock status — expanded */}
      <div className="flex items-center gap-3 rounded-md bg-parchment px-4 py-3 text-sm">
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

      {/* Qty + main CTA */}
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={qty}
          onChange={setQty}
          max={Math.max(1, product.stock)}
          disabled={isOOS}
        />
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onAdd}
          disabled={isOOS}
          className="flex-1 min-w-[200px]"
        >
          <ShoppingBag className="size-4" />
          {isOOS ? "Indisponible" : "Ajouter au panier"}
        </Button>
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
