"use client";

import * as React from "react";
import { Languages } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
}

/**
 * Pill-style FR / AR toggle for the storefront header.
 *
 * Renders as a two-segment switch where the active locale is highlighted.
 * Hidden visually below `sm` (kept as a compact icon-only fallback) to keep
 * the mobile header tight — full toggle returns at `sm+`.
 */
export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t("lang.toggle")}
      className={cn(
        "inline-flex items-center overflow-hidden rounded-full border border-wood-600/30 bg-cream text-[10px] font-semibold uppercase tracking-[0.14em] text-wood-700",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("fr")}
        aria-pressed={locale === "fr"}
        className={cn(
          "h-7 px-2.5 transition-colors",
          locale === "fr"
            ? "bg-forest-700 text-cream"
            : "hover:bg-parchment hover:text-ink"
        )}
      >
        FR
      </button>
      <span aria-hidden="true" className="h-3.5 w-px bg-wood-600/25" />
      <button
        type="button"
        onClick={() => setLocale("ar")}
        aria-pressed={locale === "ar"}
        className={cn(
          "h-7 px-2.5 transition-colors",
          locale === "ar"
            ? "bg-forest-700 text-cream"
            : "hover:bg-parchment hover:text-ink"
        )}
      >
        AR
      </button>
    </div>
  );
}

/** Compact icon-only fallback for very tight headers. Toggles on click. */
export function LanguageToggleCompact({ className }: LanguageToggleProps) {
  const { locale, toggle, t } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("lang.toggle")}
      title={`${t("lang.fr")} / ${t("lang.ar")}`}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-ink hover:bg-parchment hover:text-tangerine-600",
        className
      )}
    >
      <Languages className="size-4.5" />
      <span className="sr-only">{locale === "fr" ? "FR" : "AR"}</span>
    </button>
  );
}
