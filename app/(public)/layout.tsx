import * as React from "react";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
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

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn("contents", displaySans.variable)}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-forest-700 focus:px-4 focus:py-2 focus:text-cream"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
