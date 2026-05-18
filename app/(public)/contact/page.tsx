import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Contact",
  description: "Adresse, téléphone, horaires et formulaire de contact.",
};

export default function Page() {
  return (
    <PageStub
      title="Contact"
      pathHint="Contact"
      description="Adresse, téléphone, horaires et formulaire de contact."
      phase={6}
    />
  );
}
