"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CatalogPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  if (totalPages <= 1) return null;

  const goto = (n: number) => {
    const params = new URLSearchParams(sp.toString());
    if (n <= 1) params.delete("page");
    else params.set("page", String(n));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const pages = pageWindow(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1"
    >
      <button
        type="button"
        onClick={() => goto(page - 1)}
        disabled={page <= 1}
        aria-label="Page précédente"
        className="inline-flex size-9 items-center justify-center rounded-md border border-wood-600/20 bg-cream text-ink/80 disabled:opacity-40 hover:bg-wood-100"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`gap-${i}`}
            aria-hidden="true"
            className="px-2 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => goto(p)}
            aria-current={p === page}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-md text-sm font-medium",
              p === page
                ? "bg-forest-700 text-cream"
                : "border border-wood-600/20 bg-cream text-ink/80 hover:bg-wood-100"
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => goto(page + 1)}
        disabled={page >= totalPages}
        aria-label="Page suivante"
        className="inline-flex size-9 items-center justify-center rounded-md border border-wood-600/20 bg-cream text-ink/80 disabled:opacity-40 hover:bg-wood-100"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}

function pageWindow(current: number, total: number): Array<number | "…"> {
  const pages: Array<number | "…"> = [];
  const push = (n: number | "…") => {
    if (pages[pages.length - 1] !== n) pages.push(n);
  };
  push(1);
  if (current - 2 > 2) push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    push(i);
  }
  if (current + 2 < total - 1) push("…");
  if (total > 1) push(total);
  return pages;
}
