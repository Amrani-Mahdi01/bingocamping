import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Comparaison",
  description: "Tableau côte-à-côte de 2 à 4 produits, différences mises en évidence.",
};

export default function Page() {
  return (
    <PageStub
      title="Comparaison"
      pathHint="Comparer"
      description="Tableau côte-à-côte de 2 à 4 produits, différences mises en évidence."
      phase={5}
    />
  );
}
