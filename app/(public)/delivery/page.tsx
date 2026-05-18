import * as React from "react";
import { Truck } from "lucide-react";

import {
  StaticPageShell,
  StaticSection,
  staticMetadata,
} from "@/components/layout/StaticPageShell";
import { formatDZD } from "@/lib/format";
import { wilayas } from "@/lib/mock/wilayas";
import { Mono } from "@/components/ui/typography";

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
      eyebrow="Aide"
      title="Politique de livraison"
      lead="ZR Express dessert les 58 wilayas d'Algérie. Toutes les commandes sont expédiées sous 24 à 48h après confirmation par téléphone."
    >
      <section className="rounded-lg bg-forest-900 p-6 text-cream sm:p-8">
        <div className="flex items-center gap-3">
          <Truck className="size-6 text-wood-300" />
          <span className="font-display text-md font-semibold">
            Partenaire logistique exclusif : ZR Express
          </span>
        </div>
        <p className="mt-3 text-sm text-cream/80">
          ZR Express dispose du plus large maillage de relais et livreurs
          d&apos;Algérie. Taux de livraison réussie : 96 %.
        </p>
      </section>

      <StaticSection title="Zones desservies">
        <p>
          Toutes les wilayas, sans exception. Les délais et frais varient
          selon la région. Les villages les plus reculés peuvent demander
          un retrait au relais ZR Express le plus proche.
        </p>
      </StaticSection>

      <StaticSection title="Délais par région">
        <div className="overflow-hidden rounded-lg border border-wood-600/15 bg-cream text-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-parchment text-left text-2xs font-mono uppercase tracking-wide text-wood-700">
                <th className="px-4 py-2.5">Région</th>
                <th className="px-4 py-2.5">Wilayas</th>
                <th className="px-4 py-2.5">Délai estimé</th>
                <th className="px-4 py-2.5">Frais de livraison</th>
              </tr>
            </thead>
            <tbody>
              {byRegion.map((r) => (
                <tr
                  key={r.region}
                  className="border-t border-wood-600/10 text-ink"
                >
                  <td className="px-4 py-2.5">
                    <Mono className="text-wood-700">{r.region}</Mono>
                  </td>
                  <td className="px-4 py-2.5">{r.count}</td>
                  <td className="px-4 py-2.5">
                    {r.minDays === r.maxDays
                      ? `${r.minDays} jours`
                      : `${r.minDays}-${r.maxDays} jours`}
                  </td>
                  <td className="px-4 py-2.5 font-mono tabular-nums">
                    {r.minPrice === r.maxPrice
                      ? formatDZD(r.minPrice)
                      : `${formatDZD(r.minPrice)} - ${formatDZD(r.maxPrice)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StaticSection>

      <StaticSection title="Suivi de commande">
        <p>
          Dès l&apos;expédition, vous recevez par SMS un numéro de suivi ZR
          Express. Vous pouvez également consulter le statut depuis votre
          espace client (Mes commandes).
        </p>
      </StaticSection>

      <StaticSection title="Réception de la commande">
        <p>
          Le livreur vous contacte avant le passage. Préparez le montant exact
          en cash. Vous pouvez ouvrir le colis devant le livreur pour vérifier
          le contenu — en cas de problème, refusez le colis sans frais.
        </p>
        <p>
          Si vous êtes absent, le livreur tente une nouvelle fois ou laisse le
          colis au relais ZR Express le plus proche, à retirer sous 7 jours.
        </p>
      </StaticSection>
    </StaticPageShell>
  );
}
