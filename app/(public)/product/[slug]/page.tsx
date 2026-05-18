import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Fiche produit",
  description: "Galerie, variantes, prix, livraison estimée, avis et produits similaires.",
};

export default function Page() {
  return (
    <PageStub
      title="Fiche produit"
      pathHint="Produit"
      description="Galerie, variantes, prix, livraison estimée, avis et produits similaires."
      phase={4}
    />
  );
}
