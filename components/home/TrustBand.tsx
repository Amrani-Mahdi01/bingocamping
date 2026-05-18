import * as React from "react";
import {
  CreditCard,
  Headphones,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

interface Item {
  icon: LucideIcon;
  label: string;
  detail: string;
}

const ITEMS: Item[] = [
  {
    icon: Truck,
    label: "Livraison 48-72h",
    detail: "Partout en Algérie via ZR Express",
  },
  {
    icon: CreditCard,
    label: "Paiement à la livraison",
    detail: "Cash, sans frais supplémentaires",
  },
  {
    icon: ShieldCheck,
    label: "Garantie 30 jours",
    detail: "Échange ou remboursement",
  },
  {
    icon: Headphones,
    label: "Support 7j/7",
    detail: "Conseil par téléphone et WhatsApp",
  },
];

export function TrustBand() {
  return (
    <section
      aria-label="Engagements BINGO"
      className="border-y border-wood-600/10 bg-parchment"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:grid-cols-4 sm:px-6 sm:py-8">
        {ITEMS.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-wood-100 text-wood-700">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-ink">
                {label}
              </p>
              <p className="truncate text-xs text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
