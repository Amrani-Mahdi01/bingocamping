import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Commande",
  description: "Coordonnées, adresse de livraison ZR Express, paiement à la livraison.",
};

export default function Page() {
  return (
    <PageStub
      title="Commande"
      pathHint="Checkout"
      description="Coordonnées, adresse de livraison ZR Express, paiement à la livraison."
      phase={5}
    />
  );
}
