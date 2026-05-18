import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Détail commande",
  description: "Client, livraison, lignes, tentatives d'appel et changement de statut.",
};

export default function Page() {
  return (
    <PageStub
      title="Détail commande"
      pathHint="Admin · Commande"
      description="Client, livraison, lignes, tentatives d'appel et changement de statut."
      phase={8}
    />
  );
}
