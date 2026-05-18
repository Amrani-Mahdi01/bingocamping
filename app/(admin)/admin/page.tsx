import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description: "KPIs, évolution du chiffre d'affaires, commandes récentes et alertes.",
};

export default function Page() {
  return (
    <PageStub
      title="Tableau de bord"
      pathHint="Admin"
      description="KPIs, évolution du chiffre d'affaires, commandes récentes et alertes."
      phase={7}
    />
  );
}
