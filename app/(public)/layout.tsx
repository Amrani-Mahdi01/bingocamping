import * as React from "react";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { getPublicSettings } from "@/lib/api/settings.server";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { pageOverridesFromSettings } from "@/lib/i18n/page-overrides";
import { SiteContactProvider } from "@/lib/site-contact-context";
import { siteContactFromSettings } from "@/lib/site-contact";
import { cn } from "@/lib/utils";

// Storefront-only display font. Overrides the root `--font-display`
// (Fraunces) inside this route group; admin keeps Fraunces.
const displaySans = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BINGO — Équipement outdoor en Algérie",
    template: "%s — BINGO",
  },
  description:
    "BINGO — sélection d'équipement de plein air, livraison ZR Express partout en Algérie, paiement à la livraison.",
  openGraph: {
    type: "website",
    siteName: "BINGO",
    locale: "fr_DZ",
  },
};

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-fetch site-wide settings so the Header receives the logo URL
  // baked into HTML — no client-side flash before the image appears.
  const settings = await getPublicSettings();
  const logoUrl = (settings["site.logo"] as string | null) ?? null;
  const logoAltFr = (settings["site.logo_alt_fr"] as string | null) ?? "BINGO";
  const logoAltAr = (settings["site.logo_alt_ar"] as string | null) ?? "BINGO";
  const parseSize = (raw: unknown, fallback: number) => {
    const n = typeof raw === "string" ? parseInt(raw, 10) : NaN;
    return Number.isFinite(n) ? n : fallback;
  };
  const logoHeight = parseSize(settings["site.logo_height"], 36);
  const logoMaxWidth = parseSize(settings["site.logo_max_width"], 180);
  const logoRadius = parseSize(settings["site.logo_radius"], 0);
  const contact = siteContactFromSettings(settings);
  const pageOverrides = pageOverridesFromSettings(settings);

  return (
    <LanguageProvider overrides={pageOverrides}>
      <SiteContactProvider initialValue={contact}>
        <div className={cn("contents", displaySans.variable)}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-forest-700 focus:px-4 focus:py-2 focus:text-cream"
          >
            Aller au contenu
          </a>
          <Header
            logoUrl={logoUrl}
            logoAltFr={logoAltFr}
            logoAltAr={logoAltAr}
            logoHeight={logoHeight}
            logoMaxWidth={logoMaxWidth}
            logoRadius={logoRadius}
          />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
          <Toaster />
        </div>
      </SiteContactProvider>
    </LanguageProvider>
  );
}
