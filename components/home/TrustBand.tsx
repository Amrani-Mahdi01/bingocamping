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
      <div className="mx-auto grid max-w-7xl divide-y divide-wood-600/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {ITEMS.map(({ icon: Icon, label, detail }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-3 sm:flex-col sm:items-start sm:gap-4 sm:px-7 sm:py-8 md:flex-row md:items-center"
          >
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-tangerine-50 text-tangerine-600 sm:size-11">
              <Icon className="size-3.5 sm:size-5" strokeWidth={1.7} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-xs font-semibold text-ink leading-tight sm:text-sm">
                {label}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                {detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
