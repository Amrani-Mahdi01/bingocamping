"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, User as UserIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { routes } from "@/lib/routes";
import { useAuth } from "@/lib/stores/auth";
import { useT } from "@/lib/i18n/LanguageProvider";

/**
 * Header user widget. Two states:
 *
 * - **Guest**: small icon-button → /login
 * - **Authenticated**: avatar dropdown with profile/orders/admin/logout
 *
 * The admin link only shows when `isAdmin` is true. Hydration-guarded so
 * SSR markup matches the client.
 */
export function UserMenu() {
  const router = useRouter();
  const t = useT();
  const user = useAuth((s) => s.user);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isAdmin = useAuth((s) => s.isAdmin);
  const logout = useAuth((s) => s.logout);

  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);

  // Show the guest icon during SSR/before hydration so we don't flash an
  // authenticated avatar that the server didn't render.
  if (!hydrated || !isAuthenticated || !user) {
    return (
      <Link
        href={routes.login}
        aria-label={t("header.signIn")}
        className="inline-flex size-9 items-center justify-center rounded-md text-ink hover:bg-parchment hover:text-tangerine-600"
      >
        <UserIcon className="size-4.5" />
      </Link>
    );
  }

  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

  const handleLogout = () => {
    logout();
    router.replace(routes.home);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("header.userMenu")}
        className="inline-flex items-center justify-center rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2"
      >
        <Avatar className="size-9 border border-wood-600/25">
          <AvatarFallback
            className={
              isAdmin
                ? "bg-forest-700 text-cream text-xs"
                : "bg-wood-600 text-cream text-xs"
            }
          >
            {initials || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        {/* Plain header div — base-ui's DropdownMenuLabel requires a parent
            DropdownMenuGroup context which we don't need just to render text. */}
        <div className="flex flex-col gap-0.5 px-2 py-1.5">
          <span className="text-xs font-normal text-muted-foreground">
            {t("header.signedInAs")}
          </span>
          <span className="truncate text-sm font-semibold text-ink">
            {user.firstName} {user.lastName}
          </span>
          <span className="truncate font-mono text-2xs text-muted-foreground">
            {user.email}
          </span>
        </div>
        <DropdownMenuSeparator />

        {isAdmin ? (
          <DropdownMenuItem
            nativeButton={false}
            render={
              <Link href={routes.admin.dashboard} className="cursor-pointer">
                <LayoutDashboard className="size-4" />
                {t("header.adminPanel")}
              </Link>
            }
          />
        ) : null}

        <DropdownMenuItem
          nativeButton={false}
          render={
            <Link href={routes.account.orders} className="cursor-pointer">
              <Package className="size-4" />
              {t("header.myOrders")}
            </Link>
          }
        />

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-wood-700 focus:bg-red-50 focus:text-red-700"
        >
          <LogOut className="size-4" />
          {t("nav.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
