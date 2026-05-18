import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Favoris",
  description: "Vos produits favoris — un clic pour les retirer ou ajouter au panier.",
};

export default function Page() {
  return (
    <PageStub
      title="Favoris"
      pathHint="Compte · Favoris"
      description="Vos produits favoris — un clic pour les retirer ou ajouter au panier."
      phase={6}
    />
  );
}
