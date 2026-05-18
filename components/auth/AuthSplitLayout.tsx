import * as React from "react";
import Link from "next/link";

import { TopoLines } from "@/components/decorative/TopoLines";
import { routes } from "@/lib/routes";

interface AuthSplitLayoutProps {
  /** Right-column form content. */
  children: React.ReactNode;
  /** Tagline overlaid on the left photography column. */
  tagline?: string;
}

/**
 * Two-column auth shell — forest-themed photography placeholder left,
 * form content right. Matches the look of Filson/Snow Peak login screens.
 */
export function AuthSplitLayout({
  children,
  tagline = "L'aventure commence ici. Connectez-vous pour suivre vos commandes.",
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 md:grid-cols-[40%_1fr]">
      <aside className="relative hidden overflow-hidden bg-forest-700 text-cream md:block">
        <TopoLines
          opacity={0.35}
          stroke="rgba(250,246,239,0.3)"
          className="opacity-100"
        />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Link
            href={routes.home}
            className="inline-flex items-center gap-2"
            aria-label="BINGO — Accueil"
          >
            <span className="font-display text-lg font-semibold">BINGO</span>
            <span
              aria-hidden="true"
              className="h-4 w-6 rounded-sm bg-wood-600"
            />
          </Link>
          <div className="max-w-sm">
            <span className="inline-block rounded-md bg-cream/15 px-3 py-1 font-mono text-2xs uppercase tracking-wide">
              Équipement outdoor
            </span>
            <p className="mt-4 font-display text-2xl leading-tight">
              {tagline}
            </p>
          </div>
          <p className="font-mono text-2xs uppercase tracking-wide text-cream/70">
            © 2026 BINGO — Sétif, Algérie
          </p>
        </div>
      </aside>

      <main className="flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
