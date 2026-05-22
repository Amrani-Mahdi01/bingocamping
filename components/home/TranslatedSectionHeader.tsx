"use client";

import * as React from "react";

import { SectionHeader } from "@/components/home/SectionHeader";
import { useT } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/dictionary";

interface TranslatedSectionHeaderProps {
  eyebrow: TranslationKey;
  title: TranslationKey;
  lead?: TranslationKey;
  ctaLabel?: TranslationKey;
  ctaHref?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Client-side `SectionHeader` that takes translation keys instead of raw
 * strings, so home-page section copy automatically swaps with the active
 * locale (FR / AR).
 */
export function TranslatedSectionHeader({
  eyebrow,
  title,
  lead,
  ctaLabel,
  ctaHref,
  align,
  className,
}: TranslatedSectionHeaderProps) {
  const t = useT();
  return (
    <SectionHeader
      eyebrow={t(eyebrow)}
      title={t(title)}
      lead={lead ? t(lead) : undefined}
      ctaLabel={ctaLabel ? t(ctaLabel) : undefined}
      ctaHref={ctaHref}
      align={align}
      className={className}
    />
  );
}
