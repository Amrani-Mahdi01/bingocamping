"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Search,
  ShoppingBag,
  User as UserIcon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mainNav, routes, topCategories } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { MobileNavTrigger } from "@/components/layout/MobileNav";

const CATEGORY_PATH_RE = /^\/catalog(\/|$)/;

export function Header() {
  const pathname = usePathname();
  const isCategoryView = CATEGORY_PATH_RE.test(pathname);

  // Cart state — placeholder until Phase 3 wires the Zustand store.
  const [cartCount] = React.useState(0);
  const [favoritesCount] = React.useState(0);
  const isAuthenticated = false;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-wood-600/10 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <MobileNavTrigger className="md:hidden" />

        {/* Wordmark + accent */}
        <Link
          href={routes.home}
          className="flex shrink-0 items-center gap-2"
          aria-label="BINGO — Accueil"
        >
          <span className="font-display text-md font-semibold tracking-tight text-forest-700 sm:text-lg">
            BINGO
          </span>
          <span
            aria-hidden="true"
            className="h-3 w-4 rounded-sm bg-wood-600 sm:h-4 sm:w-6"
          />
        </Link>

        {/* Centre nav (desktop) */}
        <nav
          className="hidden flex-1 md:flex"
          aria-label="Navigation principale"
        >
          <ul className="flex w-full items-center justify-center gap-7">
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
                      "text-sm font-medium transition-colors",
                      isActive
                        ? "text-forest-700"
                        : "text-ink/80 hover:text-forest-700"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Rechercher"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "text-ink hover:text-forest-700"
            )}
          >
            <Search className="size-5" />
          </button>

          <Link
            href={routes.account.favorites}
            aria-label={`Favoris${
              favoritesCount > 0 ? ` (${favoritesCount})` : ""
            }`}
            className="relative inline-flex size-9 items-center justify-center rounded-md text-ink hover:bg-wood-100 hover:text-wood-800"
          >
            <Heart className="size-5" />
            {favoritesCount > 0 ? <CountBadge count={favoritesCount} /> : null}
          </Link>

          <Link
            href={routes.cart}
            aria-label={`Panier${cartCount > 0 ? ` (${cartCount})` : ""}`}
            className="relative inline-flex size-9 items-center justify-center rounded-md text-ink hover:bg-wood-100 hover:text-wood-800"
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 ? <CountBadge count={cartCount} /> : null}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Compte"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "text-ink hover:text-forest-700"
              )}
            >
              <UserIcon className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isAuthenticated ? (
                <>
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href={routes.account.profile} />}>
                    Mon compte
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href={routes.account.orders} />}>
                    Mes commandes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Déconnexion</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>Bienvenue</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href={routes.login} />}>
                    Se connecter
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href={routes.register} />}>
                    Créer un compte
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Secondary nav — category tabs, only on catalog pages */}
      {isCategoryView ? (
        <div className="border-t border-wood-600/10 bg-wood-100">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6">
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
                      : "text-wood-800 hover:bg-wood-200"
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
      className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-forest-700 px-1 font-mono text-[10px] text-cream tabular-nums"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
