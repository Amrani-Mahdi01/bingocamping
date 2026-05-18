import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Mono } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Optional CTA link rendered on the right (desktop) / below title (mobile). */
  ctaLabel?: string;
  ctaHref?: string;
  /** When true, the title and lead are centred. Defaults to left-aligned. */
  align?: "left" | "center";
  className?: string;
}

/**
 * Shared section header for the storefront homepage. Establishes a
 * consistent eyebrow → display title → lead → optional CTA rhythm so the
 * page breathes the same way across sections.
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  ctaLabel,
  ctaHref,
  align = "left",
  className,
}: SectionHeaderProps) {
  const isCentered = align === "center";

  return (
    <header
      className={cn(
        "mb-8 flex flex-col gap-5 sm:mb-10 md:mb-12",
        // Subtle entrance on first render
        "animate-in fade-in slide-in-from-bottom-2 duration-500",
        isCentered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("max-w-2xl", isCentered ? "mx-auto" : "")}>
        <Mono className="text-tangerine-600">{eyebrow}</Mono>
        <h2 className="mt-3 font-display text-2xl leading-[1.1] tracking-[-0.02em] text-ink sm:text-3xl md:text-[2.5rem]">
          {title}
        </h2>
        {lead ? (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {lead}
          </p>
        ) : null}
      </div>

      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className={cn(
            "group inline-flex items-center gap-1.5 self-start text-sm font-medium text-ink/80 underline-offset-4 transition-colors hover:text-tangerine-600 hover:underline",
            isCentered ? "self-center" : "md:self-end"
          )}
        >
          {ctaLabel}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      ) : null}
    </header>
  );
}
