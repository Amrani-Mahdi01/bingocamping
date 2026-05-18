import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Réponses aux questions fréquentes sur les commandes, la livraison et les retours.",
};

export default function Page() {
  return (
    <PageStub
      title="FAQ"
      pathHint="Aide"
      description="Réponses aux questions fréquentes sur les commandes, la livraison et les retours."
      phase={6}
    />
  );
}
