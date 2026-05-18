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

const SORT_OPTIONS = [
  { value: "relevance", label: "Pertinence" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "newest", label: "Nouveautés" },
  { value: "popular", label: "Popularité" },
  { value: "name_asc", label: "Nom A-Z" },
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
  const current = sp.get("sort") ?? "relevance";

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
          <span className="text-muted-foreground">Trier :</span>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {onViewChange ? (
        <div className="inline-flex rounded-md border border-wood-600/20 bg-cream">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            aria-label="Vue grille"
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
            aria-label="Vue liste"
            aria-pressed={view === "list"}
            className={cn(
              "inline-flex size-9 items-center justify-center border-l border-wood-600/20",
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
