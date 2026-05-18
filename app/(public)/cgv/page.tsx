import * as React from "react";

import {
  StaticPageShell,
  StaticSection,
  staticMetadata,
} from "@/components/layout/StaticPageShell";
import { Mono } from "@/components/ui/typography";

export const metadata = staticMetadata(
  "Conditions générales de vente",
  "CGV régissant les achats sur BINGO — Algérie."
);

const ARTICLES: Array<{ title: string; body: React.ReactNode }> = [
  {
    title: "Article 1 — Parties",
    body: (
      <>
        <p>
          Les présentes Conditions Générales de Vente (CGV) régissent les
          relations contractuelles entre&nbsp;:
        </p>
        <p>
          <strong>BINGO SARL</strong> (ci-après « le Vendeur »), au capital
          social de 100 000 DZD, dont le siège social est situé Cité Hassan
          Bey, Sétif 19000, Algérie, immatriculée au Registre du Commerce
          d&apos;Algérie sous le numéro XX/00-XXXXXXX&nbsp;;
        </p>
        <p>
          Et toute personne physique ou morale, majeure et résidant en
          Algérie, effectuant un achat sur le site bingo.dz (ci-après « le
          Client »).
        </p>
      </>
    ),
  },
  {
    title: "Article 2 — Objet et acceptation",
    body: (
      <p>
        Les CGV ont pour objet de définir les modalités de vente entre BINGO
        et le Client. Toute commande implique l&apos;acceptation pleine et
        entière des présentes conditions, opposables au Client à compter de la
        confirmation de commande.
      </p>
    ),
  },
  {
    title: "Article 3 — Produits",
    body: (
      <>
        <p>
          Les produits offerts à la vente sont décrits avec leurs
          caractéristiques essentielles sur les fiches produit du site. Les
          photographies sont fournies à titre indicatif et n&apos;engagent pas
          le Vendeur.
        </p>
        <p>
          Les produits sont vendus dans la limite des stocks disponibles. En
          cas d&apos;indisponibilité postérieure à la commande, le Client est
          informé et bénéficie d&apos;un remboursement intégral.
        </p>
      </>
    ),
  },
  {
    title: "Article 4 — Prix",
    body: (
      <p>
        Les prix sont indiqués en dinars algériens (DZD), toutes taxes
        comprises, hors frais de livraison. Les frais de livraison sont
        calculés à l&apos;étape de validation de la commande, selon la wilaya
        de destination.
      </p>
    ),
  },
  {
    title: "Article 5 — Commande",
    body: (
      <p>
        Toute commande passée sur le site fait l&apos;objet d&apos;une
        confirmation par téléphone sous 24h ouvrées. Sans réponse du Client
        après trois tentatives d&apos;appel, la commande est automatiquement
        annulée. Le Client peut suivre l&apos;état de sa commande depuis son
        espace client.
      </p>
    ),
  },
  {
    title: "Article 6 — Paiement",
    body: (
      <p>
        Le paiement est effectué exclusivement à la livraison, en numéraire
        (cash) auprès du transporteur ZR Express. Le montant total est dû au
        livreur — aucun frais supplémentaire n&apos;est appliqué pour ce mode
        de règlement.
      </p>
    ),
  },
  {
    title: "Article 7 — Livraison",
    body: (
      <p>
        Les commandes sont expédiées sous 24 à 48h après confirmation, via
        notre partenaire logistique ZR Express. Les délais de livraison varient
        de 2 à 5 jours selon la wilaya. Les délais sont indicatifs et ne
        peuvent engager la responsabilité du Vendeur en cas de retard.
      </p>
    ),
  },
  {
    title: "Article 8 — Droit de rétractation et retours",
    body: (
      <p>
        Le Client dispose d&apos;un délai de 14 jours après réception pour
        retourner les produits, dans leur emballage d&apos;origine et non
        utilisés. La procédure de retour est détaillée dans la rubrique{" "}
        <em>Retours</em> du site.
      </p>
    ),
  },
  {
    title: "Article 9 — Garantie",
    body: (
      <p>
        Tous les produits BINGO bénéficient de la garantie légale de conformité
        ainsi que de la garantie fabricant lorsqu&apos;elle est offerte par le
        constructeur (généralement 1 à 10 ans selon les marques).
      </p>
    ),
  },
  {
    title: "Article 10 — Responsabilité",
    body: (
      <p>
        Le Vendeur ne saurait être tenu responsable des dommages résultant
        d&apos;une utilisation non conforme du produit, ni des cas de force
        majeure (catastrophe naturelle, grève des transporteurs, panne réseau).
      </p>
    ),
  },
  {
    title: "Article 11 — Données personnelles",
    body: (
      <p>
        Les données collectées sont strictement nécessaires au traitement de la
        commande et à la livraison. Elles ne sont jamais cédées à des tiers en
        dehors du transporteur ZR Express. Le Client dispose d&apos;un droit
        d&apos;accès, de rectification et de suppression de ses données en
        écrivant à contact@bingo.dz.
      </p>
    ),
  },
  {
    title: "Article 12 — Litiges et droit applicable",
    body: (
      <p>
        Les présentes CGV sont soumises au droit algérien. En cas de litige, le
        Client est invité à contacter le Vendeur pour une résolution amiable
        préalable. À défaut d&apos;accord, les tribunaux de Sétif seront seuls
        compétents.
      </p>
    ),
  },
];

export default function CgvPage() {
  return (
    <StaticPageShell
      eyebrow="Légal"
      title="Conditions générales de vente"
      lead="Lecture longue mais nécessaire — voici le cadre dans lequel BINGO opère."
    >
      {ARTICLES.map((a) => (
        <StaticSection key={a.title} title={a.title}>
          {a.body}
        </StaticSection>
      ))}

      <div className="rounded-lg bg-parchment p-5 text-center">
        <Mono className="text-wood-600">Mise à jour</Mono>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Dernière révision : 1er mars 2026
        </p>
      </div>
    </StaticPageShell>
  );
}
