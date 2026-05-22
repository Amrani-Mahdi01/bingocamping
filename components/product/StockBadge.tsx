"use client";

import * as React from "react";
import { Check, Clock, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import type { StockStatus } from "@/lib/types";

interface StockBadgeProps {
  status: StockStatus;
  /** Display "in stock" copy with optional unit count, e.g. "Plus que 3 en stock". */
  stock?: number;
  /** Compact form for ProductCards (just the dot + label). */
  compact?: boolean;
  className?: string;
}

const META: Record<
  StockStatus,
  { key: TranslationKey; icon: React.ReactNode; cls: string }
> = {
  in_stock: {
    key: "stock.badge.in",
    icon: <Check className="size-3" />,
    cls: "bg-emerald-50 text-emerald-700",
  },
  low_stock: {
    key: "stock.badge.low",
    icon: <Clock className="size-3" />,
    cls: "bg-amber-50 text-amber-700",
  },
  out_of_stock: {
    key: "stock.badge.out",
    icon: <TriangleAlert className="size-3" />,
    cls: "bg-red-50 text-red-700",
  },
};

export function StockBadge({
  status,
  stock,
  compact = false,
  className,
}: StockBadgeProps) {
  const t = useT();
  const c = META[status];
  const label =
    !compact && status === "low_stock" && stock
      ? `${t("stock.lowPrefix")} ${stock}`
      : t(c.key);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium uppercase tracking-wide",
        c.cls,
        compact && "px-1.5",
        className
      )}
    >
      {c.icon}
      <span>{label}</span>
    </span>
  );
}
