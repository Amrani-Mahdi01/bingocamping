import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Livraison",
  description: "Configuration ZR Express et tarifs par wilaya.",
};

export default function Page() {
  return (
    <PageStub
      title="Livraison"
      pathHint="Admin · Livraison"
      description="Configuration ZR Express et tarifs par wilaya."
      phase={9}
    />
  );
}
