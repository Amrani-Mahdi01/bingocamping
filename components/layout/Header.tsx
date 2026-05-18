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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { mainNav, routes, topCategories } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { MobileNavTrigger } from "@/components/layout/MobileNav";
import { selectItemCount, useCart } from "@/lib/stores/cart";
import { useFavorites } from "@/lib/stores/favorites";
import { useAuth } from "@/lib/stores/auth";

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

  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const loginDemo = useAuth((s) => s.loginDemo);

  return (
    <header className="sticky top-0 z-40 w-full bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      {/* ───── Primary nav (desktop, on top) ───── */}
      <nav
        aria-label="Navigation principale"
        className="hidden border-b border-wood-600/10 md:block"
      >
        <ul className="mx-auto flex max-w-7xl items-center justify-center gap-10 px-4 py-3 sm:px-6">
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
                      className="absolute -bottom-3 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-tangerine-500"
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ───── Main bar ───── */}
      <div className="border-b border-wood-600/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:h-20 sm:px-6">
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
            <span
              aria-hidden="true"
              className="h-4 w-5 rounded-sm bg-tangerine-500 sm:h-5 sm:w-6"
            />
          </Link>

          {/* Inline search (desktop) */}
          <form
            role="search"
            action={routes.catalog}
            method="get"
            className="hidden flex-1 max-w-xl items-center md:flex md:px-6"
          >
            <label htmlFor="header-search" className="sr-only">
              Rechercher un produit
            </label>
            <div className="relative w-full">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-wood-600"
              />
              <Input
                id="header-search"
                type="search"
                name="search"
                placeholder="Rechercher tente, sac de couchage, lampe…"
                className="h-11 bg-parchment/60 pl-10 text-sm placeholder:text-muted-foreground/70 focus-visible:bg-cream"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Mobile search trigger */}
            <Link
              href={routes.catalog}
              aria-label="Rechercher"
              className="inline-flex size-10 items-center justify-center rounded-md text-ink hover:bg-parchment hover:text-tangerine-600 md:hidden"
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

            {/* Account dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Compte"
                className={cn(
                  "inline-flex items-center gap-2 rounded-md text-ink transition-colors hover:bg-parchment hover:text-tangerine-600",
                  "size-10 justify-center sm:size-auto sm:h-10 sm:px-3"
                )}
              >
                <UserIcon className="size-5" />
                <span className="hidden text-sm font-medium sm:inline">
                  {hydrated && user ? user.firstName : "Compte"}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {hydrated && isAuthenticated && user ? (
                  <>
                    <DropdownMenuLabel>
                      {user.firstName} {user.lastName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      nativeButton={false}
                      render={<Link href={routes.account.profile} />}
                    >
                      Mon compte
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      nativeButton={false}
                      render={<Link href={routes.account.orders} />}
                    >
                      Mes commandes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      nativeButton={false}
                      render={<Link href={routes.account.favorites} />}
                    >
                      Mes favoris
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                      Déconnexion
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Bienvenue</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      nativeButton={false}
                      render={<Link href={routes.login} />}
                    >
                      Se connecter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      nativeButton={false}
                      render={<Link href={routes.register} />}
                    >
                      Créer un compte
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => loginDemo()}>
                      Connecter (démo)
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
