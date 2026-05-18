import * as React from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { Mono, Small } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  /** Optional change indicator — positive = green, negative = ember. */
  change?: number;
  /** Optional one-line subtitle (e.g. "Sur les 30 derniers jours"). */
  subtitle?: string;
  icon: LucideIcon;
  /** Children render below value (e.g. a sparkline). */
  children?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  subtitle,
  icon: Icon,
  children,
  className,
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg bg-parchment p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-wood-100 text-wood-700">
          <Icon className="size-4" />
        </span>
        {typeof change === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium",
              isPositive
                ? "bg-forest-100 text-forest-800"
                : "bg-ember/10 text-ember"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(change * 100).toFixed(1)} %
          </span>
        ) : null}
      </div>
      <Mono className="mt-4 text-wood-700">{label}</Mono>
      <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink">
        {value}
      </p>
      {subtitle ? <Small className="mt-1">{subtitle}</Small> : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
