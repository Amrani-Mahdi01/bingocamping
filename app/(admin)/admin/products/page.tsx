import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Produits",
  description: "Liste paginée avec recherche, filtres et actions en lot.",
};

export default function Page() {
  return (
    <PageStub
      title="Produits"
      pathHint="Admin · Produits"
      description="Liste paginée avec recherche, filtres et actions en lot."
      phase={7}
    />
  );
}
