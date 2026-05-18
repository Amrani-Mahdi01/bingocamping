import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Catégorie",
  description: "Page de catégorie — produits filtrés par sous-univers, avec sidebar de filtres.",
};

export default function Page() {
  return (
    <PageStub
      title="Catégorie"
      pathHint="Catalogue · Catégorie"
      description="Page de catégorie — produits filtrés par sous-univers, avec sidebar de filtres."
      phase={4}
    />
  );
}
