import type { Metadata } from "next";
import { Cairo, Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Arabic typeface — Cairo. Widely used across MENA web design; clean,
// rounded humanist sans-serif that reads naturally and pairs well with
// Latin sans fonts. Activated via [lang="ar"] in globals.css.
const arabicFont = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BINGO — Équipement outdoor en Algérie",
    template: "%s — BINGO",
  },
  description:
    "BINGO — sélection d'équipement de plein air, livraison ZR Express partout en Algérie, paiement à la livraison.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn(
        "h-full antialiased",
        fraunces.variable,
        inter.variable,
        jetbrainsMono.variable,
        arabicFont.variable
      )}
    >
      <body className="min-h-full flex flex-col font-body bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
