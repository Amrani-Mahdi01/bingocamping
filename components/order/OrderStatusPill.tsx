import * as React from "react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: "En attente", cls: "bg-wood-100 text-wood-800" },
  confirmed: { label: "Confirmée", cls: "bg-forest-100 text-forest-800" },
  preparing: { label: "Préparation", cls: "bg-forest-100 text-forest-800" },
  shipped: { label: "Expédiée", cls: "bg-wood-200 text-wood-900" },
  delivered: { label: "Livrée", cls: "bg-forest-700 text-cream" },
  cancelled: { label: "Annulée", cls: "bg-zinc-200 text-zinc-700" },
  returned: { label: "Retournée", cls: "bg-ember/10 text-ember" },
};

export function OrderStatusPill({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  const s = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-medium uppercase tracking-wide",
        s.cls,
        className
      )}
    >
      {s.label}
    </span>
  );
}
