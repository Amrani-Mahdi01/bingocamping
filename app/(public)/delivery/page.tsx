import * as React from "react";
import { Truck } from "lucide-react";

import {
  StaticPageShell,
  StaticSection,
  staticMetadata,
} from "@/components/layout/StaticPageShell";
import { T } from "@/components/i18n/T";
import { DeliveryRegionsTable } from "@/components/info/DeliveryRegionsTable";
import { wilayas } from "@/lib/mock/wilayas";

export const metadata = staticMetadata(
  "Politique de livraison",
  "Livraison ZR Express dans les 58 wilayas d'Algérie — délais, frais et procédures."
);

export default function DeliveryPage() {
  // Group wilayas by region for the pricing table summary.
  const regions = ["Nord", "Centre", "Est", "Ouest", "Sud"] as const;
  const byRegion = regions.map((region) => {
    const list = wilayas.filter((w) => w.region === region);
    const prices = list.map((w) => w.shippingPrice);
    const days = list.map((w) => w.deliveryDays);
    return {
      region,
      count: list.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      minDays: Math.min(...days),
      maxDays: Math.max(...days),
    };
  });

  return (
    <StaticPageShell
      eyebrow={<T k="info.delivery.eyebrow" />}
      title={<T k="info.delivery.title" />}
    >
      <section className="rounded-lg bg-forest-900 p-6 text-cream sm:p-8">
        <div className="flex items-center gap-3">
          <Truck className="size-6 text-wood-300" />
          <span className="font-display text-md font-semibold">
            <T k="delivery.banner.title" />
          </span>
        </div>
        <p className="mt-3 text-sm text-cream/80">
          <T k="delivery.banner.lead" />
        </p>
      </section>

      <StaticSection title={<T k="delivery.zones.title" />}>
        <p>
          <T k="delivery.zones.p1" />
        </p>
      </StaticSection>

      <StaticSection title={<T k="delivery.table.title" />}>
        <DeliveryRegionsTable rows={byRegion} />
      </StaticSection>

      <StaticSection title={<T k="delivery.tracking.title" />}>
        <p>
          <T k="delivery.tracking.p1" />
        </p>
      </StaticSection>

      <StaticSection title={<T k="delivery.reception.title" />}>
        <p>
          <T k="delivery.reception.p1" />
        </p>
        <p>
          <T k="delivery.reception.p2" />
        </p>
      </StaticSection>
    </StaticPageShell>
  );
}
