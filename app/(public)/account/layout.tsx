"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  User as UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mono, Small } from "@/components/ui/typography";
import { useAuth } from "@/lib/stores/auth";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

const NAV = [
  { label: "Mes commandes", href: routes.account.orders, icon: Package },
  { label: "Favoris", href: routes.account.favorites, icon: Heart },
  { label: "Adresses", href: routes.account.addresses, icon: MapPin },
  { label: "Profil", href: routes.account.profile, icon: UserIcon },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);

  React.useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace(routes.login);
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated || !user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg bg-parchment p-4">
            <div className="flex items-center gap-3 pb-4">
              <Avatar className="size-12 border border-wood-600/20">
                <AvatarFallback className="bg-wood-600 text-cream">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-ink">
                  {user.firstName} {user.lastName}
                </p>
                <Small>Membre depuis {formatDate(user.createdAt)}</Small>
              </div>
            </div>
            <nav aria-label="Compte" className="border-t border-wood-600/15 pt-3">
              <ul className="space-y-0.5">
                {NAV.map(({ label, href, icon: Icon }) => {
                  const isActive = pathname.startsWith(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "border-l-2 border-forest-700 bg-wood-100 pl-[10px] font-medium text-forest-700"
                            : "text-ink/80 hover:bg-wood-100/60"
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        {label}
                      </Link>
                    </li>
                  );
                })}
                <li className="border-t border-wood-600/15 pt-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      router.replace(routes.home);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-wood-700 hover:bg-wood-100/60"
                  >
                    <LogOut className="size-4 shrink-0" />
                    Déconnexion
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <main className="min-w-0">
          <Mono className="text-wood-600">Compte</Mono>
          {children}
        </main>
      </div>
    </div>
  );
}
