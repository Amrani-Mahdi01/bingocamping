import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connexion à votre compte BINGO — split-screen avec photographie de la nature.",
};

export default function Page() {
  return (
    <PageStub
      title="Connexion"
      pathHint="Auth"
      description="Connexion à votre compte BINGO — split-screen avec photographie de la nature."
      phase={6}
    />
  );
}
