import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Détail commande",
  description: "Timeline de statut, lignes, adresse de livraison et support client.",
};

export default function Page() {
  return (
    <PageStub
      title="Détail commande"
      pathHint="Compte · Commande"
      description="Timeline de statut, lignes, adresse de livraison et support client."
      phase={6}
    />
  );
}
