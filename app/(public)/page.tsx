import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Body, H1, Mono } from "@/components/ui/typography";
import { PineDivider } from "@/components/decorative/PineDivider";
import { TopoLines } from "@/components/decorative/TopoLines";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-cream px-6 py-24">
      <TopoLines opacity={0.6} />
      <div className="relative max-w-2xl text-center">
        <Mono className="text-wood-600">Phase 2 — Coquilles &amp; navigation</Mono>
        <H1 className="mt-4">BINGO</H1>
        <Body className="mt-6 mx-auto max-w-lg text-base text-muted-foreground">
          Équipement outdoor en Algérie. La vitrine définitive arrive à la
          phase 4 — pour l&apos;instant, toutes les routes sont accessibles
          comme stubs.
        </Body>
        <PineDivider />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={routes.catalog}
            className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
          >
            Voir le catalogue
          </Link>
          <Link
            href={routes.designSystem}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Design system
          </Link>
          <Link
            href={routes.admin.dashboard}
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
          >
            Administration →
          </Link>
        </div>
      </div>
    </section>
  );
}
