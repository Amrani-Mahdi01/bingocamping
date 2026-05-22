"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";

import { mainNav, routes, topCategories } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { MobileNavTrigger } from "@/components/layout/MobileNav";
import { UserMenu } from "@/components/layout/UserMenu";
import { selectItemCount, useCart } from "@/lib/stores/cart";
import { useFavorites } from "@/lib/stores/favorites";
import { useLanguage, useT } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/dictionary";

interface HeaderProps {
  /** Logo image URL — when set, replaces the text wordmark. */
  logoUrl?: string | null;
  logoAltFr?: string | null;
  logoAltAr?: string | null;
  /** Display tuning — pixel values from /api/settings. */
  logoHeight?: number;
  logoMaxWidth?: number;
  /** Border-radius in px; values ≥ 50 become a perfect circle. */
  logoRadius?: number;
}

// Maps each mainNav href to a translation key so labels swap with locale.
const NAV_LABEL_KEY: Record<string, TranslationKey> = {
  [routes.catalog]: "nav.catalog",
  [`${routes.catalog}?promoOnly=true`]: "nav.promotions",
  [routes.about]: "nav.about",
  [routes.contact]: "nav.contact",
};

const CATEGORY_PATH_RE = /^\/catalog(\/|$)/;

export function Header({
  logoUrl,
  logoAltFr,
  logoAltAr,
  logoHeight = 36,
  logoMaxWidth = 180,
  logoRadius = 0,
}: HeaderProps = {}) {
  const pathname = usePathname();
  const isCategoryView = CATEGORY_PATH_RE.test(pathname);
  const t = useT();
  const { locale } = useLanguage();
  const logoAlt =
    locale === "ar"
      ? logoAltAr ?? logoAltFr ?? "BINGO"
      : logoAltFr ?? logoAltAr ?? "BINGO";

  // Hydration guard so SSR markup matches client.
  const cartCount = useCart(selectItemCount);
  const favoritesCount = useFavorites((s) => s.items.length);
  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);


  return (
    <header className="sticky top-0 z-40 w-full bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      {/* ───── Top bar: wordmark · nav · search (md+) · actions ───── */}
      <div className="border-b border-wood-600/10">
        {/* min-h keeps the baseline 56/64 px, but vertical padding lets the
            bar grow to fit a taller logo (up to the 96 px slider max). */}
        <div className="mx-auto flex min-h-14 max-w-7xl items-center gap-3 px-4 py-2 sm:min-h-16 sm:gap-5 sm:px-6 sm:py-2.5 lg:gap-7">
          {/* Wordmark / logo */}
          <Link
            href={routes.home}
            className="flex shrink-0 items-center gap-2"
            aria-label={`${logoAlt} — ${t("nav.home")}`}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={logoAlt}
                style={{
                  height: `${logoHeight}px`,
                  maxWidth: `${logoMaxWidth}px`,
                  // Values at the slider's top become a perfect circle.
                  borderRadius: logoRadius >= 50 ? "9999px" : `${logoRadius}px`,
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            ) : (
              <span className="font-display text-lg font-semibold tracking-tight text-forest-700 sm:text-xl">
                {logoAlt}
              </span>
            )}
          </Link>

          {/* Inline nav (md+) — sits next to the logo */}
          <nav
            aria-label="Navigation principale"
            className="hidden md:block"
          >
            <ul className="flex items-center gap-5 lg:gap-7">
              {mainNav.map((link) => {
                const isActive =
                  link.href === pathname ||
                  (link.href !== routes.home &&
                    pathname.startsWith(link.href.split("?")[0]!));
                const key = NAV_LABEL_KEY[link.href];
                const label = key ? t(key) : link.label;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative text-sm font-medium transition-colors lg:text-[15px]",
                        isActive
                          ? "text-forest-700"
                          : "text-ink/70 hover:text-tangerine-600"
                      )}
                    >
                      {label}
                      {isActive ? (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-1.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-tangerine-500"
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right cluster: inline search (md+) + actions.
                `ms-auto` (logical margin-inline-start) pushes the cluster to
                the end of the row — right in LTR, left in RTL. */}
          <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden md:block">
              <HeaderSearch className="w-56 lg:w-64" />
            </div>

            <LanguageToggle className="hidden sm:inline-flex" />

            {/* Heart / profile / cart — desktop only. On mobile these live
                inside the MobileNav drawer (top icon row). */}
            <div className="hidden items-center gap-1 sm:gap-2 md:flex">
              <Link
                href={routes.favorites}
                aria-label={`${t("nav.favorites")}${
                  favoritesCount > 0 ? ` (${favoritesCount})` : ""
                }`}
                className="relative inline-flex size-9 items-center justify-center rounded-md text-ink hover:bg-parchment hover:text-tangerine-600"
              >
                <Heart className="size-4.5" />
                {hydrated && favoritesCount > 0 ? (
                  <CountBadge count={favoritesCount} />
                ) : null}
              </Link>

              <UserMenu />

              <CartDrawer>
                <button
                  type="button"
                  aria-label={`${t("header.cart")}${
                    cartCount > 0 ? ` (${cartCount})` : ""
                  }`}
                  className="relative inline-flex size-9 items-center justify-center rounded-md text-ink hover:bg-parchment hover:text-tangerine-600"
                >
                  <ShoppingBag className="size-4.5" />
                  {hydrated && cartCount > 0 ? <CountBadge count={cartCount} /> : null}
                </button>
              </CartDrawer>
            </div>

            {/* Hamburger — mobile only, sits at the inline-end of the cluster
                (visual right in LTR, visual left in RTL). */}
            <MobileNavTrigger className="md:hidden" />
          </div>
        </div>

        {/* ───── Mobile-only search row ───── */}
        <div className="flex items-center gap-2 border-t border-wood-600/10 px-4 py-2 md:hidden">
          <HeaderSearch className="min-w-0 flex-1" />
          <LanguageToggle />
        </div>
      </div>

      {/* ───── Secondary category strip on /catalog/* ───── */}
      {isCategoryView ? (
        <div className="border-b border-wood-600/10 bg-parchment">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
            {topCategories.map((cat) => {
              const isActive = pathname === cat.href;
              // The href ends in /catalog/<slug>; extract the slug to look up
              // its translated label so the strip swaps with the locale.
              const slug = cat.href.split("/").pop() ?? "";
              const catKey = `cat.${slug}` as TranslationKey;
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
                  {t(catKey)}
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
      className="absolute -end-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-tangerine-500 px-1 font-mono text-[10px] text-cream tabular-nums"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
