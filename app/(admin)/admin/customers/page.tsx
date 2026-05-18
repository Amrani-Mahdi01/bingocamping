import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Clients",
  description: "Liste des clients avec total dépensé, dernière commande et statut.",
};

export default function Page() {
  return (
    <PageStub
      title="Clients"
      pathHint="Admin · Clients"
      description="Liste des clients avec total dépensé, dernière commande et statut."
      phase={8}
    />
  );
}
