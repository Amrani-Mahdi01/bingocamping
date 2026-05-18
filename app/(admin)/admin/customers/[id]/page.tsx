import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Détail client",
  description: "Historique des commandes, adresses, activité et notes internes.",
};

export default function Page() {
  return (
    <PageStub
      title="Détail client"
      pathHint="Admin · Client"
      description="Historique des commandes, adresses, activité et notes internes."
      phase={8}
    />
  );
}
