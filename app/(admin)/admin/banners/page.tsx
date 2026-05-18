import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Bannières",
  description: "Gestion des bannières de la page d'accueil — ordre, dates, statut.",
};

export default function Page() {
  return (
    <PageStub
      title="Bannières"
      pathHint="Admin · Bannières"
      description="Gestion des bannières de la page d'accueil — ordre, dates, statut."
      phase={9}
    />
  );
}
