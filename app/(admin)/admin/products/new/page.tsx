import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Nouveau produit",
  description: "Formulaire de création — informations, prix, médias, variantes, SEO.",
};

export default function Page() {
  return (
    <PageStub
      title="Nouveau produit"
      pathHint="Admin · Produits"
      description="Formulaire de création — informations, prix, médias, variantes, SEO."
      phase={7}
    />
  );
}
