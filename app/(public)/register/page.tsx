import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Création de compte — coordonnées, mot de passe, acceptation des CGV.",
};

export default function Page() {
  return (
    <PageStub
      title="Inscription"
      pathHint="Auth"
      description="Création de compte — coordonnées, mot de passe, acceptation des CGV."
      phase={6}
    />
  );
}
