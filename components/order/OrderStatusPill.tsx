import * as React from "react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: "En attente", cls: "bg-amber-50 text-amber-700" },
  confirmed: { label: "Confirmée", cls: "bg-blue-50 text-blue-700" },
  preparing: { label: "Préparation", cls: "bg-indigo-50 text-indigo-700" },
  shipped: { label: "Expédiée", cls: "bg-violet-50 text-violet-700" },
  delivered: { label: "Livrée", cls: "bg-emerald-600 text-white" },
  cancelled: { label: "Annulée", cls: "bg-zinc-100 text-zinc-600" },
  returned: { label: "Retournée", cls: "bg-red-50 text-red-700" },
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
