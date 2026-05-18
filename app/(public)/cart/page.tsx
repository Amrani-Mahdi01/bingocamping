import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Panier",
  description: "Récapitulatif des articles avant commande, ajustement des quantités, code promo.",
};

export default function Page() {
  return (
    <PageStub
      title="Panier"
      pathHint="Panier"
      description="Récapitulatif des articles avant commande, ajustement des quantités, code promo."
      phase={5}
    />
  );
}
