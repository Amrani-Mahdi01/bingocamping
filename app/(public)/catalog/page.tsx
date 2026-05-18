import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Découvrez l'ensemble de notre sélection d'équipement outdoor.",
};

export default function Page() {
  return (
    <PageStub
      title="Catalogue"
      pathHint="Catalogue"
      description="Découvrez l'ensemble de notre sélection d'équipement outdoor."
      phase={4}
    />
  );
}
