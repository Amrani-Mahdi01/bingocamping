import * as React from "react";
import { H1, Mono } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Right-side slot — CTAs, filters etc. */
  actions?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-wrap items-end justify-between gap-3",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow ? <Mono className="text-wood-600">{eyebrow}</Mono> : null}
        <H1 className="mt-1 text-2xl">{title}</H1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
