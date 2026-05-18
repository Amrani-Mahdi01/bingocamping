import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Mes commandes",
  description: "Historique des commandes avec statuts, recherche et filtres.",
};

export default function Page() {
  return (
    <PageStub
      title="Mes commandes"
      pathHint="Compte · Commandes"
      description="Historique des commandes avec statuts, recherche et filtres."
      phase={6}
    />
  );
}
