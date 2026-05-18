import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Adresses",
  description: "Carnet d'adresses pour des commandes plus rapides.",
};

export default function Page() {
  return (
    <PageStub
      title="Adresses"
      pathHint="Compte · Adresses"
      description="Carnet d'adresses pour des commandes plus rapides."
      phase={6}
    />
  );
}
