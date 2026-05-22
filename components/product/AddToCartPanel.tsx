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
import { useT } from "@/lib/i18n/LanguageProvider";
import type { Product } from "@/lib/types";

export function AddToCartPanel({
  product,
  variant: variantProp,
  onVariantChange,
  quantity: quantityProp,
  onQuantityChange,
}: {
  product: Product;
  /** Optional controlled variant — when the product page lifts state. */
  variant?: string;
  onVariantChange?: (value: string) => void;
  /** Optional controlled quantity. */
  quantity?: number;
  onQuantityChange?: (n: number) => void;
}) {
  const t = useT();
  const hasVariants = product.variants.length > 0;

  // Internal state used only when the parent doesn't pass controlled props.
  const [variantInner, setVariantInner] = React.useState<string | undefined>(
    hasVariants ? product.variants[0]?.value : undefined
  );
  const [qtyInner, setQtyInner] = React.useState(1);

  // Resolve to the controlled value when provided, otherwise the inner one.
  const variant = variantProp !== undefined ? variantProp : variantInner;
  const setVariant = (v: string) => {
    if (onVariantChange) onVariantChange(v);
    else setVariantInner(v);
  };
  const qty = quantityProp !== undefined ? quantityProp : qtyInner;
  const setQty = (n: number) => {
    if (onQuantityChange) onQuantityChange(n);
    else setQtyInner(n);
  };

  const addToCart = useCart((s) => s.addItem);
  const toggleFavorite = useFavorites((s) => s.toggle);
  const isFavoriteRaw = useFavorites((s) => s.isFavorite(product.id));

  // Hydration guard — the favorites store reads from localStorage on
  // mount, so the SSR-rendered "off" state would mismatch the client's
  // "on" state for items that are already favourited. Pretend "not
  // favourited" until hydration completes, then sync.
  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);
  const isFavorite = hydrated && isFavoriteRaw;

  const isOOS = product.stockStatus === "out_of_stock";

  const onAdd = () => {
    if (isOOS) return;
    addToCart(product, { variant, quantity: qty });
    toast.success(`${product.name} — ${t("atc.addedToast")}`, {
      description:
        variant && hasVariants
          ? `${t("atc.variant")} : ${variant} · ${t("atc.quantity")} ${qty}`
          : `${t("atc.quantity")} : ${qty}`,
    });
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
          {product.stockStatus === "in_stock" && t("stock.expedited")}
          {product.stockStatus === "low_stock" &&
            `${t("stock.lowPrefix")} ${product.stock} ${t("stock.lowSuffix")}`}
          {product.stockStatus === "out_of_stock" && t("stock.outOfStock")}
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
            {isOOS ? t("product.outOfStock") : t("product.addToCart")}
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={onCommander}
            disabled={isOOS}
            className="h-auto w-full flex-1 bg-tangerine-500 px-4 py-3.5 text-base text-cream shadow-sm hover:bg-tangerine-600 active:bg-tangerine-700 sm:w-auto sm:px-6 sm:py-2.5 sm:text-sm"
          >
            <Zap className="size-5 sm:size-4" fill="currentColor" />
            {t("product.order")}
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
            toast.success(
              isFavorite ? t("atc.favRemovedToast") : t("atc.favAddedToast")
            );
          }}
        >
          <Heart
            className="size-4"
            fill={isFavorite ? "currentColor" : "none"}
          />
          {isFavorite ? t("atc.favOn") : t("atc.favOff")}
        </Button>
      </div>
    </div>
  );
}
