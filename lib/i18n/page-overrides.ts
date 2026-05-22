/**
 * Helpers that turn the flat `page.<dotted-key>.<fr|ar>` entries from
 * `/api/settings` (or localStorage) into the per-locale override maps
 * consumed by `LanguageProvider`. Keys with empty values are skipped so
 * the dictionary fallback wins for those.
 */

export interface PageOverrides {
  fr: Record<string, string>;
  ar: Record<string, string>;
}

export function emptyPageOverrides(): PageOverrides {
  return { fr: {}, ar: {} };
}

export function pageOverridesFromSettings(
  map: Record<string, string | null | undefined>
): PageOverrides {
  const out = emptyPageOverrides();
  for (const [k, v] of Object.entries(map)) {
    if (typeof v !== "string" || v.length === 0) continue;
    if (!k.startsWith("page.")) continue;
    if (k.endsWith(".fr")) {
      out.fr[k.slice("page.".length, -".fr".length)] = v;
    } else if (k.endsWith(".ar")) {
      out.ar[k.slice("page.".length, -".ar".length)] = v;
    }
  }
  return out;
}

/** Merge `b` on top of `a` (b wins when both have a key). */
export function mergePageOverrides(
  a: PageOverrides,
  b: PageOverrides
): PageOverrides {
  return {
    fr: { ...a.fr, ...b.fr },
    ar: { ...a.ar, ...b.ar },
  };
}
