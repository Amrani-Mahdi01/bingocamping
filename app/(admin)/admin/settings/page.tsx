import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Configuration",
  description: "Informations du site, coordonnées, réseaux sociaux, notifications, politiques.",
};

export default function Page() {
  return (
    <PageStub
      title="Configuration"
      pathHint="Admin · Config"
      description="Informations du site, coordonnées, réseaux sociaux, notifications, politiques."
      phase={9}
    />
  );
}
