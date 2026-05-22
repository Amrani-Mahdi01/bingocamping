"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/LanguageProvider";

interface CatalogSearchProps {
  /** Total products matching the current filters. */
  total: number;
  className?: string;
}

/**
 * Search input for the catalog page. Debounces user input and writes the
 * value to the URL as `?search=...`, which the server component re-reads
 * and uses to filter the product list.
 */
export function CatalogSearch({ total, className }: CatalogSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const t = useT();
  const initial = sp.get("search") ?? "";

  const [value, setValue] = React.useState(initial);

  // Sync local input when URL changes (back/forward navigation).
  React.useEffect(() => {
    setValue(initial); // eslint-disable-line react-hooks/set-state-in-effect
  }, [initial]);

  // Debounced URL write — 250ms after the user stops typing.
  React.useEffect(() => {
    if (value === initial) return;
    const t = setTimeout(() => {
      const params = new URLSearchParams(sp.toString());
      if (value.trim()) params.set("search", value.trim());
      else params.delete("search");
      params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 250);
    return () => clearTimeout(t);
  }, [value, initial, pathname, router, sp]);

  const clear = () => setValue("");

  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-wood-600"
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("catalog.searchPlaceholder")}
        className="h-14 rounded-xl border-wood-600/20 bg-cream ps-12 pe-12 text-base placeholder:text-muted-foreground/70 focus-visible:border-tangerine-500 focus-visible:ring-tangerine-500/20"
        aria-label={t("catalog.searchAria")}
      />
      {value ? (
        <button
          type="button"
          onClick={clear}
          aria-label={t("catalog.clearSearch")}
          className="absolute end-3 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-wood-700 hover:bg-wood-100"
        >
          <X className="size-4" />
        </button>
      ) : null}

      {/* Live result count, shown below the input when searching */}
      {value.trim() ? (
        <p className="absolute -bottom-6 start-2 text-xs text-muted-foreground">
          <span className="font-mono tabular-nums">{total}</span>{" "}
          {total > 1 ? t("catalog.results_other") : t("catalog.results_one")}{" "}
          {t("catalog.resultsFor")} &laquo;&nbsp;{value.trim()}
          &nbsp;&raquo;
        </p>
      ) : null}
    </div>
  );
}
