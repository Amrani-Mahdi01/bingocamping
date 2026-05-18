"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  href?: string;
}

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Tableau de bord",
  products: "Produits",
  new: "Nouveau",
  categories: "Catégories",
  orders: "Commandes",
  customers: "Clients",
  statistics: "Statistiques",
  settings: "Configuration",
  banners: "Bannières",
  shipping: "Livraison",
};

function buildBreadcrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];
  let acc = "";
  segments.forEach((seg, index) => {
    acc += `/${seg}`;
    const label = SEGMENT_LABELS[seg] ?? decodeURIComponent(seg);
    const isLast = index === segments.length - 1;
    crumbs.push({ label, href: isLast ? undefined : acc });
  });
  return crumbs;
}

export function AdminTopbar() {
  const pathname = usePathname();
  const crumbs = React.useMemo(() => buildBreadcrumbs(pathname), [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-wood-600/10 bg-cream/95 px-4 backdrop-blur sm:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" className="min-w-0 flex-1">
        <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <React.Fragment key={crumb.label + i}>
                {i > 0 ? (
                  <ChevronRight
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-wood-400"
                  />
                ) : null}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="truncate text-wood-700 hover:text-forest-700"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "truncate",
                      isLast ? "font-medium text-ink" : "text-wood-700"
                    )}
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>

      {/* Centre search (md+) */}
      <button
        type="button"
        className="hidden h-9 flex-1 max-w-xs items-center gap-2 rounded-md border border-wood-600/15 bg-parchment/60 px-3 text-xs text-muted-foreground hover:bg-parchment md:inline-flex"
      >
        <Search className="size-3.5" />
        <span>Rechercher…</span>
        <kbd className="ml-auto rounded border border-wood-600/20 bg-cream px-1.5 py-0.5 font-mono text-[10px] text-wood-700">
          ⌘K
        </kbd>
      </button>

      {/* Right cluster */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications (3 non lues)"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" }),
            "relative text-ink hover:text-forest-700"
          )}
        >
          <Bell className="size-5" />
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 font-mono text-[10px] text-cream tabular-nums"
          >
            3
          </span>
        </button>

        {/* Language switcher — placeholder until i18n wires up */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Langue"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-1 px-2 font-mono text-2xs uppercase text-wood-700 hover:text-forest-700"
            )}
          >
            FR
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Français</DropdownMenuItem>
            <DropdownMenuItem disabled>العربية (à venir)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Compte administrateur"
            className="inline-flex items-center justify-center rounded-md"
          >
            <Avatar className="size-9 border border-wood-600/40">
              <AvatarFallback className="bg-forest-700 text-cream text-xs">
                AD
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Admin BINGO</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href={routes.admin.settings} />}
            >
              Configuration
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href={routes.home} />}>
              Voir la boutique
            </DropdownMenuItem>
            <DropdownMenuItem>Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
