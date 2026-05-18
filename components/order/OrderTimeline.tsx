import * as React from "react";
import {
  Check,
  Clock,
  Package,
  PhoneCall,
  Truck,
  X,
  type LucideIcon,
} from "lucide-react";

import { Small } from "@/components/ui/typography";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OrderStatus, StatusHistoryEntry } from "@/lib/types";

const STEPS: Array<{
  status: OrderStatus;
  title: string;
  detail: string;
  icon: LucideIcon;
}> = [
  {
    status: "pending",
    title: "Commande reçue",
    detail: "Votre commande est enregistrée",
    icon: Check,
  },
  {
    status: "confirmed",
    title: "Confirmation",
    detail: "Validée par téléphone",
    icon: PhoneCall,
  },
  {
    status: "preparing",
    title: "Préparation",
    detail: "Emballage et étiquetage",
    icon: Package,
  },
  {
    status: "shipped",
    title: "Expédition",
    detail: "Confiée à ZR Express",
    icon: Truck,
  },
  {
    status: "delivered",
    title: "Livraison",
    detail: "Remise au client",
    icon: Check,
  },
];

const TERMINAL: OrderStatus[] = ["cancelled", "returned"];

export function OrderTimeline({
  current,
  history,
}: {
  current: OrderStatus;
  history: StatusHistoryEntry[];
}) {
  const completedSet = new Set(history.map((h) => h.status));
  const currentIdx = STEPS.findIndex((s) => s.status === current);

  if (TERMINAL.includes(current)) {
    const Icon = current === "cancelled" ? X : Clock;
    return (
      <div className="rounded-lg border border-ember/30 bg-ember/5 p-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-ember/20 text-ember">
            <Icon className="size-4" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-ember">
              {current === "cancelled" ? "Commande annulée" : "Commande retournée"}
            </p>
            <Small>
              {history[history.length - 1]?.at
                ? formatDateTime(history[history.length - 1]!.at)
                : ""}
            </Small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ol className="space-y-4">
      {STEPS.map((step, i) => {
        const isDone = completedSet.has(step.status) && i < currentIdx;
        const isActive = step.status === current;
        const isPending = !isDone && !isActive;
        const entry = history.find((h) => h.status === step.status);

        return (
          <li key={step.status} className="flex gap-4">
            <span
              className={cn(
                "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full",
                isDone && "bg-forest-700 text-cream",
                isActive &&
                  "bg-wood-400 text-cream ring-4 ring-wood-200 animate-pulse",
                isPending && "bg-parchment text-wood-600"
              )}
            >
              <step.icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "font-display text-sm font-semibold",
                  isPending ? "text-muted-foreground" : "text-ink"
                )}
              >
                {step.title}
              </p>
              <Small>{step.detail}</Small>
            </div>
            <span className="shrink-0 font-mono text-2xs text-wood-700">
              {entry ? formatDateTime(entry.at) : "—"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
