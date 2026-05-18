import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Commandes",
  description: "Toutes les commandes avec filtres par statut, wilaya et plage de dates.",
};

export default function Page() {
  return (
    <PageStub
      title="Commandes"
      pathHint="Admin · Commandes"
      description="Toutes les commandes avec filtres par statut, wilaya et plage de dates."
      phase={8}
    />
  );
}
