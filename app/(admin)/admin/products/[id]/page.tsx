import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Édition produit",
  description: "Édition d'un produit existant — mêmes sections que la création.",
};

export default function Page() {
  return (
    <PageStub
      title="Édition produit"
      pathHint="Admin · Produit"
      description="Édition d'un produit existant — mêmes sections que la création."
      phase={7}
    />
  );
}
