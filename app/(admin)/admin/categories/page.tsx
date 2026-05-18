import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Catégories",
  description: "Arbre des catégories en glisser-déposer, éditeur latéral.",
};

export default function Page() {
  return (
    <PageStub
      title="Catégories"
      pathHint="Admin · Catégories"
      description="Arbre des catégories en glisser-déposer, éditeur latéral."
      phase={7}
    />
  );
}
