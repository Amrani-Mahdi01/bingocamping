"use client";

import * as React from "react";
import { DirectionProvider } from "@base-ui/react/direction-provider";

import { formatDZD } from "@/lib/format";

import {
  emptyPageOverrides,
  mergePageOverrides,
  pageOverridesFromSettings,
  type PageOverrides,
} from "./page-overrides";
import { readLocalSettings } from "@/lib/site-contact";

import {
  DEFAULT_LOCALE,
  translate,
  type Locale,
  type TranslationKey,
} from "./dictionary";

const STORAGE_KEY = "bingo-locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
  /** Translate a key using the active locale, falling back to French. */
  t: (key: TranslationKey) => string;
  /** Reading direction for the current locale. */
  dir: "ltr" | "rtl";
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  overrides: initialOverrides = emptyPageOverrides(),
}: {
  children: React.ReactNode;
  /** Admin-edited dictionary entries (from `page.*` settings). */
  overrides?: PageOverrides;
}) {
  const [locale, setLocaleState] = React.useState<Locale>(DEFAULT_LOCALE);
  const [overrides, setOverrides] =
    React.useState<PageOverrides>(initialOverrides);

  // Overlay locally-cached page.* overrides on top of the server-supplied
  // ones (handles the case where the admin saved edits before the backend
  // started accepting page.* keys, or hasn't refreshed yet). Re-runs on
  // cross-tab storage events too.
  React.useEffect(() => {
    const apply = () => {
      const local = pageOverridesFromSettings(readLocalSettings());
      setOverrides(mergePageOverrides(initialOverrides, local));
    };
    apply();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "bingo.siteContact.v1") apply();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [initialOverrides]);

  // Hydrate from localStorage on mount.
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "fr" || stored === "ar") setLocaleState(stored);
    } catch {
      /* localStorage may be unavailable (SSR, privacy modes) — keep default */
    }
  }, []);

  // Mirror locale onto the <html> element so global CSS can react (dir/lang
  // attributes drive RTL flips and browser font handling).
  React.useEffect(() => {
    const html = document.documentElement;
    const previousLang = html.lang;
    const previousDir = html.dir;
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";
    return () => {
      html.lang = previousLang;
      html.dir = previousDir;
    };
  }, [locale]);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* swallow — UI already updated */
    }
  }, []);

  const toggle = React.useCallback(() => {
    setLocale(locale === "fr" ? "ar" : "fr");
  }, [locale, setLocale]);

  const t = React.useCallback(
    (key: TranslationKey) => {
      const override = overrides[locale]?.[key as string];
      if (typeof override === "string" && override.length > 0) return override;
      return translate(locale, key);
    },
    [locale, overrides]
  );

  const value = React.useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      toggle,
      t,
      dir: locale === "ar" ? "rtl" : "ltr",
    }),
    [locale, setLocale, toggle, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {/* Tells base-ui (Slider, Popover, Tabs, …) which direction to lay out
          in — without this they default to LTR even when <html dir="rtl"> is
          set, because base-ui reads from its own React context, not the DOM. */}
      <DirectionProvider direction={value.dir}>{children}</DirectionProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

/** Convenience hook for components that only need the translator. */
export function useT() {
  return useLanguage().t;
}

/**
 * Locale-bound DZD formatter. Returns a stable `(amount) => string`
 * that uses "DZD" suffix for French and "دج" for Arabic. Use this in
 * storefront client components so prices follow the customer's chosen
 * language.
 */
export function useFormatDZD() {
  const { locale } = useLanguage();
  return React.useCallback(
    (amount: number) => formatDZD(amount, locale),
    [locale]
  );
}
