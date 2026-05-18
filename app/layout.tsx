import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
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
        jetbrainsMono.variable
      )}
    >
      <body className="min-h-full flex flex-col font-body bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
