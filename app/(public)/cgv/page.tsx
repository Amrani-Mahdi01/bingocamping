import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "CGV",
  description: "Conditions générales de vente — articles 1 à 12 régissant les commandes.",
};

export default function Page() {
  return (
    <PageStub
      title="CGV"
      pathHint="Légal"
      description="Conditions générales de vente — articles 1 à 12 régissant les commandes."
      phase={6}
    />
  );
}
