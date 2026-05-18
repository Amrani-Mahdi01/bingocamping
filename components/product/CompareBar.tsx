"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useCompare, COMPARE_MAX } from "@/lib/stores/compare";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const items = useCompare((s) => s.items);
  const remove = useCompare((s) => s.removeItem);
  const clear = useCompare((s) => s.clear);
  const pathname = usePathname();

  // Avoid SSR/CSR mismatch — store is empty on server.
  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);

  if (!hydrated || items.length === 0 || pathname === routes.compare) {
    return null;
  }

  const empties = Math.max(0, COMPARE_MAX - items.length);

  return (
    <div
      aria-live="polite"
      className="animate-in slide-in-from-bottom-4 fade-in fixed inset-x-0 bottom-0 z-40 border-t border-forest-950 bg-forest-900 text-cream shadow-lg duration-300"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="shrink-0">
          <p className="font-display text-sm font-semibold">
            Comparaison ({items.length}/{COMPARE_MAX})
          </p>
          <p className="text-2xs text-cream/60">
            Ajoutez au moins 2 produits pour comparer.
          </p>
        </div>

        <ul className="flex flex-1 flex-wrap items-center gap-2">
          {items.map((p) => (
            <li
              key={p.id}
              className="group/cb relative inline-flex items-center gap-2 rounded-md border border-forest-700 bg-forest-950 px-2 py-1 pr-7"
            >
              <span className="relative size-10 shrink-0 overflow-hidden rounded-sm">
                <Image
                  src={p.images[0]?.url ?? "/api/placeholder/100/100"}
                  alt={p.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="max-w-[160px] truncate text-xs text-cream">
                {p.name}
              </span>
              <button
                type="button"
                onClick={() => remove(p.id)}
                aria-label={`Retirer ${p.name} de la comparaison`}
                className="absolute right-1 top-1/2 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-cream/60 hover:bg-forest-800 hover:text-cream"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
          {Array.from({ length: empties }, (_, i) => (
            <li
              key={`empty-${i}`}
              aria-hidden="true"
              className="inline-flex size-12 items-center justify-center rounded-md border border-dashed border-wood-400/40 text-xs text-cream/40"
            >
              +
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="text-xs text-cream/70 hover:text-cream"
          >
            Effacer
          </button>
          <Link
            href={routes.compare}
            aria-disabled={items.length < 2}
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              items.length < 2 && "pointer-events-none opacity-60"
            )}
          >
            Comparer
          </Link>
        </div>
      </div>
    </div>
  );
}
