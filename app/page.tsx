import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Body, H1, Mono } from "@/components/ui/typography";
import { PineDivider } from "@/components/decorative/PineDivider";
import { TopoLines } from "@/components/decorative/TopoLines";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-cream px-6 py-24">
      <TopoLines opacity={0.6} />
      <div className="relative max-w-2xl text-center">
        <Mono className="text-wood-600">Phase 1 — Foundation</Mono>
        <H1 className="mt-4">BINGO</H1>
        <Body className="mt-6 mx-auto max-w-lg text-base text-muted-foreground">
          Équipement outdoor en Algérie. La boutique elle-même arrive à la
          phase 4. Pour l&apos;instant, explorez la base de design.
        </Body>
        <PineDivider />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/design-system"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
          >
            Voir le design system
          </Link>
          <Link
            href="#"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            À propos
          </Link>
        </div>
      </div>
    </main>
  );
}
