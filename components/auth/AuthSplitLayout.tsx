"use client";

import * as React from "react";
import Link from "next/link";

import { TopoLines } from "@/components/decorative/TopoLines";
import { http } from "@/lib/api/http";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n/LanguageProvider";

interface AuthSplitLayoutProps {
  /** Right-column form content. */
  children: React.ReactNode;
  /** Override the default photography tagline. Pre-translated when passed. */
  tagline?: string;
}

/**
 * Two-column auth shell — forest-themed photography placeholder left,
 * form content right. Matches the look of Filson/Snow Peak login screens.
 *
 * Pulls the admin-uploaded site logo via the public settings endpoint
 * and shows it on the green panel. Falls back to the text "BINGO" mark
 * while loading, or if no logo has been uploaded yet.
 */
export function AuthSplitLayout({ children, tagline }: AuthSplitLayoutProps) {
  const t = useT();
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [logoAlt, setLogoAlt] = React.useState<string>("BINGO");
  const [logoHeight, setLogoHeight] = React.useState(40);
  const [logoMaxWidth, setLogoMaxWidth] = React.useState(200);
  const [logoRadius, setLogoRadius] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    http
      .get<{ data: Record<string, string | null> }>("/api/settings", { auth: "none" })
      .then((res) => {
        if (cancelled) return;
        setLogoUrl(res.data["site.logo"] ?? null);
        setLogoAlt(res.data["site.logo_alt_fr"] ?? "BINGO");
        const num = (raw: string | null | undefined, fallback: number) => {
          const n = typeof raw === "string" ? parseInt(raw, 10) : NaN;
          return Number.isFinite(n) ? n : fallback;
        };
        setLogoHeight(num(res.data["site.logo_height"], 40));
        setLogoMaxWidth(num(res.data["site.logo_max_width"], 200));
        setLogoRadius(num(res.data["site.logo_radius"], 0));
      })
      .catch(() => {
        /* leave fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 md:grid-cols-[40%_1fr]">
      <aside className="relative hidden overflow-hidden bg-forest-700 text-cream md:block">
        <TopoLines
          opacity={0.35}
          stroke="rgba(250,246,239,0.3)"
          className="opacity-100"
        />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Link
            href={routes.home}
            className="inline-flex items-center gap-2"
            aria-label={logoAlt}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={logoAlt}
                style={{
                  height: `${logoHeight}px`,
                  maxWidth: `${logoMaxWidth}px`,
                  borderRadius:
                    logoRadius >= 50 ? "9999px" : `${logoRadius}px`,
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            ) : (
              <>
                <span className="font-display text-lg font-semibold">
                  BINGO
                </span>
                <span
                  aria-hidden="true"
                  className="h-4 w-6 rounded-sm bg-wood-600"
                />
              </>
            )}
          </Link>
          <div className="max-w-sm">
            <span className="inline-block rounded-md bg-cream/15 px-3 py-1 font-mono text-2xs uppercase tracking-wide">
              {t("auth.split.eyebrow")}
            </span>
            <p className="mt-4 font-display text-2xl leading-tight">
              {tagline ?? t("auth.split.tagline")}
            </p>
          </div>
          <p className="font-mono text-2xs uppercase tracking-wide text-cream/70">
            {t("auth.split.copyright")}
          </p>
        </div>
      </aside>

      <main className="flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
