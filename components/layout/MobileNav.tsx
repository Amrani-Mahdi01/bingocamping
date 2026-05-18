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
  topCategories,
} from "@/lib/routes";
import { cn } from "@/lib/utils";

interface MobileNavTriggerProps {
  className?: string;
}

/**
 * Renders the hamburger Sheet trigger together with the navigation drawer.
 * Mounted from the Header — splitting the trigger element keeps it in flow
 * with the rest of the header bar.
 */
export function MobileNavTrigger({ className }: MobileNavTriggerProps) {
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Ouvrir le menu"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "text-ink hover:text-forest-700",
          className
        )}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
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
          <ul className="mb-4 space-y-0.5 px-2">
            {mainNav.map((link) => (
              <li key={link.href}>
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href={link.href}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-cream/90 hover:bg-forest-800 hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  }
                />
              </li>
            ))}
          </ul>

          {/* Categories accordion */}
          <div className="px-2">
            <Accordion>
              <AccordionItem
                value="categories"
                className="border-forest-700"
              >
                <AccordionTrigger className="px-3 py-2 text-sm font-medium text-cream hover:bg-forest-800 hover:no-underline">
                  Catégories
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <ul className="space-y-0.5">
                    {topCategories.map((cat) => (
                      <li key={cat.href}>
                        <SheetClose
                          nativeButton={false}
                          render={
                            <Link
                              href={cat.href}
                              className="block rounded-md px-5 py-2 text-sm text-cream/80 hover:bg-forest-800 hover:text-cream"
                            >
                              {cat.label}
                            </Link>
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Help links */}
          <ul className="mt-4 space-y-0.5 px-2">
            {footerNav.aide.map((link) => (
              <li key={link.href}>
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href={link.href}
                      className="block rounded-md px-3 py-2 text-sm text-cream/80 hover:bg-forest-800 hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  }
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Account section */}
        <div className="border-t border-forest-700 px-4 py-4">
          <p className="mb-2 text-2xs font-mono uppercase tracking-wide text-cream/60">
            Compte
          </p>
          <ul className="space-y-0.5">
            {accountMenu.map((link) => (
              <li key={link.href}>
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href={link.href}
                      className="block rounded-md px-3 py-2 text-sm text-cream/90 hover:bg-forest-800 hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  }
                />
              </li>
            ))}
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
                  Se connecter
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
                  Créer un compte
                </Link>
              }
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
