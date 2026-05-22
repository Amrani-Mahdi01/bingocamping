"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/lib/stores/auth";
import { adminToken, http, HttpError } from "@/lib/api/http";
import { routes } from "@/lib/routes";

/**
 * Client-side gate for the admin section.
 *
 * - Guest → bounced to /login
 * - Authenticated customer (not admin) → bounced to / with a toast
 * - Stale session (auth flag true, but no token / 401 from backend) → bounced
 *   to /login. This catches users who logged in BEFORE the real Laravel
 *   admin-auth was wired and only have a local "isAdmin" flag with no token.
 * - Admin with a valid token → renders the children
 *
 * Hydration-guarded so SSR doesn't redirect before localStorage rehydrates.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isAdmin = useAuth((s) => s.isAdmin);
  const logout = useAuth((s) => s.logout);

  const [hydrated, setHydrated] = React.useState(false);
  const [verified, setVerified] = React.useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.replace(routes.login);
      return;
    }
    if (!isAdmin) {
      toast.error("Accès réservé aux administrateurs");
      router.replace(routes.home);
      return;
    }

    // Auth state says we're admin — confirm against the backend so a stale
    // local flag without a real token can't slip through.
    const token = adminToken.get();
    if (!token) {
      toast.error("Session expirée — reconnectez-vous.");
      logout();
      router.replace(routes.login);
      return;
    }

    let cancelled = false;
    http
      .get("/api/admin/me", { auth: "admin" })
      .then(() => {
        if (!cancelled) setVerified(true);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof HttpError && err.status === 401) {
          toast.error("Session expirée — reconnectez-vous.");
          logout();
          router.replace(routes.login);
        } else {
          // Network or 5xx — allow render so we don't lock out admins when
          // the API is briefly unreachable; individual page calls will toast.
          setVerified(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, isAuthenticated, isAdmin, logout, router]);

  if (!hydrated || !isAuthenticated || !isAdmin || !verified) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 text-sm text-zinc-500">
        Vérification de la session…
      </div>
    );
  }

  return <>{children}</>;
}
