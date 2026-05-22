"use client";

import * as React from "react";

import { useT } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/dictionary";

/**
 * Tiny client-side translation primitive. Drops anywhere inside server-rendered
 * markup so individual strings switch with the active locale without forcing
 * the parent component to go "use client".
 *
 * Usage:
 *   <h2><T k="home.editorial.title" /></h2>
 */
export function T({ k }: { k: TranslationKey }) {
  const t = useT();
  return <>{t(k)}</>;
}
