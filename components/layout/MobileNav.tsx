"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  accountMenu,
  footerNav,
  mainNav,
  routes,
} from "@/lib/routes";
import { cn } from "@/lib/utils";
import { http } from "@/lib/api/http";
import { useLanguage, useT } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import type { ApiCategory } from "@/lib/api/categories";

const NAV_LABEL_KEY: Record<string, TranslationKey> = {
  [routes.catalog]: "nav.catalog",
  [`${routes.catalog}?promoOnly=true`]: "nav.promotions",
  [routes.cart]: "nav.myCart",
  [routes.about]: "nav.about",
  [routes.contact]: "nav.contact",
};

// Footer "Aide" column shown lower in the drawer.
const HELP_LABEL_KEY: Record<string, TranslationKey> = {
  [routes.delivery]: "footer.link.delivery",
  [routes.returns]: "footer.link.returns",
  [routes.faq]: "footer.link.faq",
  [routes.contact]: "nav.contact",
};

// Account quick links section.
const ACCOUNT_LABEL_KEY: Record<string, TranslationKey> = {
  [routes.account.orders]: "account.nav.orders",
  [routes.favorites]: "account.nav.favorites",
  [routes.account.addresses]: "account.nav.addresses",
};

interface MobileNavTriggerProps {
  className?: string;
}

/**
 * Renders the hamburger Sheet trigger together with the navigation drawer.
 * Mounted from the Header — splitting the trigger element keeps it in flow
 * with the rest of the header bar.
 */
export function MobileNavTrigger({ className }: MobileNavTriggerProps) {
  const t = useT();
  const { locale } = useLanguage();
  // Slide in from the inline-start side: left in LTR (French), right in
  // RTL (Arabic) — same edge the hamburger button itself sits on.
  const side = locale === "ar" ? "right" : "left";

  // Live category list — pulled from Laravel so the drawer reflects what
  // the admin has actually created, with both FR and AR names.
  const [cats, setCats] = React.useState<ApiCategory[] | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    http
      .get<{ data: ApiCategory[] }>("/api/categories", { auth: "none" })
      .then((res) => {
        if (!cancelled) setCats(res.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const catName = (c: ApiCategory) =>
    locale === "ar" && c.nameAr ? c.nameAr : c.nameFr;

  return (
    <Sheet>
      <SheetTrigger
        aria-label={t("header.openMenu")}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "text-ink hover:text-forest-700",
          className
        )}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side={side}
        className="bg-forest-900 text-cream sm:max-w-xs"
      >
        <div className="flex items-center justify-between border-b border-forest-700 px-5 py-4">
          <SheetClose
            nativeButton={false}
            render={
              <Link href={routes.home} aria-label="BINGO — Accueil">
                <span className="font-display text-lg font-semibold text-cream">
                  BINGO
                </span>
              </Link>
            }
          />
          <SheetTitle className="sr-only">Menu mobile</SheetTitle>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {/* Primary links */}
          <ul className="mb-4 space-y-1 px-2">
            {mainNav.map((link) => {
              const key = NAV_LABEL_KEY[link.href];
              const label = key ? t(key) : link.label;
              return (
                <li key={link.href}>
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href={link.href}
                        className="block rounded-md px-3 py-3 text-base font-medium text-cream/90 hover:bg-forest-800 hover:text-cream"
                      >
                        {label}
                      </Link>
                    }
                  />
                </li>
              );
            })}
          </ul>

          {/* Categories accordion */}
          <div className="px-2">
            <Accordion>
              <AccordionItem
                value="categories"
                className="border-forest-700"
              >
                <AccordionTrigger className="px-3 py-3 text-base font-medium text-cream hover:bg-forest-800 hover:no-underline">
                  {t("nav.catalog")}
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  {cats === null ? (
                    <p className="px-5 py-2.5 text-xs text-cream/50">
                      {t("favorites.loading")}
                    </p>
                  ) : cats.length === 0 ? (
                    <p className="px-5 py-2.5 text-xs text-cream/50">
                      —
                    </p>
                  ) : (
                    <ul className="space-y-0.5">
                      {cats.map((cat) => (
                        <li key={cat.id}>
                          <SheetClose
                            nativeButton={false}
                            render={
                              <Link
                                href={routes.category(cat.slug)}
                                className="block rounded-md px-5 py-2.5 text-sm text-cream/80 hover:bg-forest-800 hover:text-cream"
                              >
                                {catName(cat)}
                              </Link>
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Help links */}
          <ul className="mt-4 space-y-0.5 px-2">
            {footerNav.aide.map((link) => {
              const helpKey = HELP_LABEL_KEY[link.href];
              const label = helpKey ? t(helpKey) : link.label;
              return (
                <li key={link.href}>
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href={link.href}
                        className="block rounded-md px-3 py-2.5 text-sm text-cream/80 hover:bg-forest-800 hover:text-cream"
                      >
                        {label}
                      </Link>
                    }
                  />
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Account section */}
        <div className="border-t border-forest-700 px-4 py-4">
          <p className="mb-2 text-2xs font-mono uppercase tracking-wide text-cream/60">
            {t("nav.account")}
          </p>
          <ul className="space-y-0.5">
            {accountMenu.map((link) => {
              const accKey = ACCOUNT_LABEL_KEY[link.href];
              const label = accKey ? t(accKey) : link.label;
              return (
                <li key={link.href}>
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href={link.href}
                        className="block rounded-md px-3 py-2.5 text-sm text-cream/90 hover:bg-forest-800 hover:text-cream"
                      >
                        {label}
                      </Link>
                    }
                  />
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex gap-2">
            <SheetClose
              nativeButton={false}
              render={
                <Link
                  href={routes.login}
                  className={cn(
                    buttonVariants({ variant: "primary", size: "sm" }),
                    "flex-1"
                  )}
                >
                  {t("nav.login")}
                </Link>
              }
            />
            <SheetClose
              nativeButton={false}
              render={
                <Link
                  href={routes.register}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "flex-1 border-cream/30 bg-transparent text-cream hover:bg-forest-800 hover:text-cream hover:border-cream/50"
                  )}
                >
                  {t("nav.register")}
                </Link>
              }
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
