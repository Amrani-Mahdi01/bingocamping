"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Search, ShoppingBag } from "lucide-react";

import { mainNav, routes, topCategories } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { MobileNavTrigger } from "@/components/layout/MobileNav";
import { selectItemCount, useCart } from "@/lib/stores/cart";
import { useFavorites } from "@/lib/stores/favorites";

const CATEGORY_PATH_RE = /^\/catalog(\/|$)/;

export function Header() {
  const pathname = usePathname();
  const isCategoryView = CATEGORY_PATH_RE.test(pathname);

  // Hydration guard so SSR markup matches client.
  const cartCount = useCart(selectItemCount);
  const favoritesCount = useFavorites((s) => s.items.length);
  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);


  return (
    <header className="sticky top-0 z-40 w-full bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      {/* ───── Single bar: wordmark · nav · actions ───── */}
      <div className="border-b border-wood-600/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:h-20 sm:px-6 lg:gap-10">
          <MobileNavTrigger className="md:hidden" />

          {/* Wordmark */}
          <Link
            href={routes.home}
            className="flex shrink-0 items-center gap-2"
            aria-label="BINGO — Accueil"
          >
            <span className="font-display text-xl font-semibold tracking-tight text-forest-700 sm:text-2xl">
              BINGO
            </span>
          </Link>

          {/* Inline nav (desktop) */}
          <nav
            aria-label="Navigation principale"
            className="hidden flex-1 md:block"
          >
            <ul className="flex items-center gap-7 lg:gap-9">
              {mainNav.map((link) => {
                const isActive =
                  link.href === pathname ||
                  (link.href !== routes.home &&
                    pathname.startsWith(link.href.split("?")[0]!));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative text-sm font-medium transition-colors",
                        isActive
                          ? "text-forest-700"
                          : "text-ink/70 hover:text-tangerine-600"
                      )}
                    >
                      {link.label}
                      {isActive ? (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-2 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-tangerine-500"
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href={routes.catalog}
              aria-label="Rechercher"
              className="inline-flex size-10 items-center justify-center rounded-md text-ink hover:bg-parchment hover:text-tangerine-600"
            >
              <Search className="size-5" />
            </Link>

            <Link
              href={routes.account.favorites}
              aria-label={`Favoris${
                favoritesCount > 0 ? ` (${favoritesCount})` : ""
              }`}
              className="relative inline-flex size-10 items-center justify-center rounded-md text-ink hover:bg-parchment hover:text-tangerine-600"
            >
              <Heart className="size-5" />
              {hydrated && favoritesCount > 0 ? (
                <CountBadge count={favoritesCount} />
              ) : null}
            </Link>

            <Link
              href={routes.cart}
              aria-label={`Panier${cartCount > 0 ? ` (${cartCount})` : ""}`}
              className="relative inline-flex size-10 items-center justify-center rounded-md text-ink hover:bg-parchment hover:text-tangerine-600"
            >
              <ShoppingBag className="size-5" />
              {hydrated && cartCount > 0 ? <CountBadge count={cartCount} /> : null}
            </Link>

          </div>
        </div>

      </div>

      {/* ───── Secondary category strip on /catalog/* ───── */}
      {isCategoryView ? (
        <div className="border-b border-wood-600/10 bg-parchment">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
            {topCategories.map((cat) => {
              const isActive = pathname === cat.href;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={cn(
                    "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-forest-700 text-cream"
                      : "text-wood-800 hover:bg-wood-100"
                  )}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-tangerine-500 px-1 font-mono text-[10px] text-cream tabular-nums"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
