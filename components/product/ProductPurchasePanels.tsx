"use client";

import * as React from "react";

import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { QuickOrderForm } from "@/components/product/QuickOrderForm";
import type { Product } from "@/lib/types";

/**
 * Shared-state wrapper for the two purchase panels on the product detail
 * page. The variant + quantity the customer picks in `AddToCartPanel`
 * (the top widget with colour swatches + size pills) flows into the
 * `QuickOrderForm` (the inline COD order form below) — so when they click
 * "Commander" they don't have to re-pick anything.
 */
export function ProductPurchasePanels({ product }: { product: Product }) {
  const initialVariant =
    product.variants.length > 0 ? product.variants[0]?.value : undefined;

  const [variant, setVariant] = React.useState<string | undefined>(initialVariant);
  const [quantity, setQuantity] = React.useState<number>(1);

  return (
    <>
      <div className="mt-5 sm:mt-6">
        <AddToCartPanel
          product={product}
          variant={variant}
          onVariantChange={setVariant}
          quantity={quantity}
          onQuantityChange={setQuantity}
        />
      </div>
      <div className="mt-5 sm:mt-6">
        <QuickOrderForm
          product={product}
          variant={variant}
          onVariantChange={setVariant}
          quantity={quantity}
          onQuantityChange={setQuantity}
        />
      </div>
    </>
  );
}
