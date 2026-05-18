import * as React from "react";
import Link from "next/link";

import {
  StaticPageShell,
  StaticSection,
  staticMetadata,
} from "@/components/layout/StaticPageShell";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const metadata = staticMetadata(
  "Politique de retour",
  "Retour sous 14 jours sur tous les produits éligibles — conditions, procédure et remboursement."
);

export default function ReturnsPage() {
  return (
    <StaticPageShell
      eyebrow="Aide"
      title="Politique de retour"
      lead="Vous disposez de 14 jours après réception pour changer d'avis ou demander un échange — sans justification."
    >
      <StaticSection title="Délai de retour">
        <p>
          Le délai court à compter du jour de réception. Au-delà de 14 jours,
          seuls les retours pour défaut produit sont acceptés (sous garantie
          fabricant).
        </p>
      </StaticSection>

      <StaticSection title="Conditions">
        <ul className="list-disc space-y-2 pl-5">
          <li>Produit non utilisé, dans son emballage d&apos;origine.</li>
          <li>Étiquettes et accessoires d&apos;origine présents.</li>
          <li>
            Preuve d&apos;achat ou numéro de commande BINGO communicable.
          </li>
        </ul>
      </StaticSection>

      <StaticSection title="Procédure">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Contactez-nous par téléphone, WhatsApp ou email avec votre numéro
            de commande et le motif du retour.
          </li>
          <li>
            Nous organisons un retour ZR Express depuis votre adresse. Vous
            recevez par SMS le numéro de prise en charge.
          </li>
          <li>
            Préparez le colis avec le produit dans son emballage et les
            accessoires d&apos;origine. Le livreur récupère le colis chez vous.
          </li>
          <li>
            Dès réception et contrôle dans nos locaux (sous 48h), nous
            procédons au remboursement.
          </li>
        </ol>
      </StaticSection>

      <StaticSection title="Remboursement">
        <p>
          Le remboursement est effectué par le moyen de votre choix : transfert
          BaridiMob, virement bancaire, ou avoir BINGO valable 1 an (avec un
          bonus de +10% sur le montant remboursé).
        </p>
        <p>
          Délai de traitement : 5 jours ouvrés après réception du retour.
        </p>
      </StaticSection>

      <StaticSection title="Frais de retour">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Produit défectueux à l&apos;arrivée :</strong> retour gratuit,
            BINGO prend en charge.
          </li>
          <li>
            <strong>Erreur de notre part (mauvais produit / taille) :</strong>{" "}
            retour gratuit.
          </li>
          <li>
            <strong>Changement d&apos;avis :</strong> frais de retour ZR Express
            à votre charge (mêmes tarifs que la livraison initiale).
          </li>
        </ul>
      </StaticSection>

      <StaticSection title="Exceptions">
        <p>
          Pour des raisons d&apos;hygiène ou de sécurité, certains produits ne
          peuvent pas être retournés une fois ouverts :
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Sous-vêtements et chaussettes techniques.</li>
          <li>Gourdes et popotes utilisées.</li>
          <li>Produits alimentaires (rations, lyophilisés).</li>
          <li>
            Produits soldés à plus de -50% : remboursement uniquement sous forme
            d&apos;avoir.
          </li>
        </ul>
      </StaticSection>

      <div className="rounded-lg bg-forest-900 p-6 text-center text-cream sm:p-8">
        <p className="font-display text-lg">
          Un problème avec votre commande ? On s&apos;en occupe.
        </p>
        <Link
          href={routes.contact}
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "mt-5"
          )}
        >
          Demander un retour
        </Link>
      </div>
    </StaticPageShell>
  );
}
