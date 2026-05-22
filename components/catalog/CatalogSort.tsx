"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/dictionary";

const SORT_OPTIONS: { value: string; key: TranslationKey }[] = [
  { value: "relevance", key: "catalog.sort.relevance" },
  { value: "price_asc", key: "catalog.sort.price_asc" },
  { value: "price_desc", key: "catalog.sort.price_desc" },
  { value: "newest", key: "catalog.sort.newest" },
  { value: "popular", key: "catalog.sort.popular" },
  { value: "name_asc", key: "catalog.sort.name_asc" },
];

export function CatalogSort({
  view = "grid",
  onViewChange,
}: {
  view?: "grid" | "list";
  onViewChange?: (v: "grid" | "list") => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const t = useT();
  const current = sp.get("sort") ?? "relevance";
  // Resolve the active sort value to its translated label — base-ui's
  // SelectValue otherwise echoes the raw `value` ("relevance") instead
  // of the SelectItem's rendered children.
  const currentLabelKey =
    SORT_OPTIONS.find((o) => o.value === current)?.key ??
    "catalog.sort.relevance";

  const onSort = (value: string | null) => {
    if (!value) return;
    const params = new URLSearchParams(sp.toString());
    if (value === "relevance") params.delete("sort");
    else params.set("sort", value);
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3">
      <Select value={current} onValueChange={onSort}>
        <SelectTrigger className="h-9 w-[180px] bg-cream text-xs">
          <span className="text-muted-foreground">{t("catalog.sort.label")}</span>
          <SelectValue>{t(currentLabelKey)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {t(o.key)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {onViewChange ? (
        <div className="inline-flex rounded-md border border-wood-600/20 bg-cream">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            aria-label={t("catalog.view.grid")}
            aria-pressed={view === "grid"}
            className={cn(
              "inline-flex size-9 items-center justify-center",
              view === "grid"
                ? "bg-wood-100 text-wood-800"
                : "text-ink/70 hover:text-ink"
            )}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("list")}
            aria-label={t("catalog.view.list")}
            aria-pressed={view === "list"}
            className={cn(
              "inline-flex size-9 items-center justify-center border-s border-wood-600/20",
              view === "list"
                ? "bg-wood-100 text-wood-800"
                : "text-ink/70 hover:text-ink"
            )}
          >
            <List className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
