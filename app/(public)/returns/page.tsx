import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Retours",
  description: "Politique de retour 14 jours — conditions, procédure et remboursement.",
};

export default function Page() {
  return (
    <PageStub
      title="Retours"
      pathHint="Aide · Retours"
      description="Politique de retour 14 jours — conditions, procédure et remboursement."
      phase={6}
    />
  );
}
