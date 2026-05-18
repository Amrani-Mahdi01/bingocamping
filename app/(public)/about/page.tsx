import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "À propos",
  description: "Notre histoire, notre équipe, notre vision de l'équipement outdoor en Algérie.",
};

export default function Page() {
  return (
    <PageStub
      title="À propos"
      pathHint="BINGO"
      description="Notre histoire, notre équipe, notre vision de l'équipement outdoor en Algérie."
      phase={6}
    />
  );
}
