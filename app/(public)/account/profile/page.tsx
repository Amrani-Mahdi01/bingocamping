import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Mon profil",
  description: "Informations personnelles, mot de passe et préférences de notifications.",
};

export default function Page() {
  return (
    <PageStub
      title="Mon profil"
      pathHint="Compte · Profil"
      description="Informations personnelles, mot de passe et préférences de notifications."
      phase={6}
    />
  );
}
