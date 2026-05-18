import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Statistiques",
  description: "Vue d'ensemble, produits, commandes, clients, carte de l'Algérie.",
};

export default function Page() {
  return (
    <PageStub
      title="Statistiques"
      pathHint="Admin · Stats"
      description="Vue d'ensemble, produits, commandes, clients, carte de l'Algérie."
      phase={9}
    />
  );
}
