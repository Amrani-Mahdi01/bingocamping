import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Livraison",
  description: "Politique de livraison ZR Express — délais, frais et zones desservies.",
};

export default function Page() {
  return (
    <PageStub
      title="Livraison"
      pathHint="Aide · Livraison"
      description="Politique de livraison ZR Express — délais, frais et zones desservies."
      phase={6}
    />
  );
}
