import * as React from "react";
import { cn } from "@/lib/utils";
import { discountPercent, formatDZD } from "@/lib/format";

interface PriceDisplayProps {
  price: number;
  oldPrice?: number;
  size?: "sm" | "md" | "lg";
  /** Show "Économisez X DZD (-Y%)" pill underneath. Default false for cards. */
  showSavings?: boolean;
  className?: string;
}

const SIZES = {
  sm: { current: "text-md", old: "text-xs" },
  md: { current: "text-md font-semibold", old: "text-xs" },
  lg: { current: "text-xl font-semibold", old: "text-sm" },
};

export function PriceDisplay({
  price,
  oldPrice,
  size = "md",
  showSavings = false,
  className,
}: PriceDisplayProps) {
  const cls = SIZES[size];
  const discount = discountPercent(price, oldPrice);
  const savings = oldPrice && oldPrice > price ? oldPrice - price : 0;

  return (
    <div className={cn("flex flex-col items-start", className)}>
      {oldPrice && oldPrice > price ? (
        <span
          className={cn("font-body text-muted-foreground line-through", cls.old)}
        >
          {formatDZD(oldPrice)}
        </span>
      ) : null}
      <span
        className={cn(
          "font-display tabular-nums leading-tight text-ink",
          cls.current,
          oldPrice ? "text-ember" : ""
        )}
      >
        {formatDZD(price)}
      </span>
      {showSavings && savings > 0 ? (
        <span className="mt-1 inline-flex items-center rounded-full bg-moss/15 px-2 py-0.5 text-2xs font-medium text-moss">
          Économisez {formatDZD(savings)}
          {discount ? ` (-${discount} %)` : ""}
        </span>
      ) : null}
    </div>
  );
}
