import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Confirmation",
  description: "Numéro de commande, prochaines étapes, suivi de livraison.",
};

export default function Page() {
  return (
    <PageStub
      title="Confirmation"
      pathHint="Checkout · Confirmation"
      description="Numéro de commande, prochaines étapes, suivi de livraison."
      phase={5}
    />
  );
}
