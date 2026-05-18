import Link from "next/link";
import { Compass, TreePine } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { TopoLines } from "@/components/decorative/TopoLines";
import { Body, H1, Mono } from "@/components/ui/typography";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Page introuvable",
  description: "Cette page n'existe pas — retournez à l'accueil.",
};

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[100vh] items-center justify-center overflow-hidden bg-cream px-4 py-16">
      <TopoLines opacity={0.6} />
      <div className="relative max-w-xl text-center">
        <div className="mx-auto flex items-center justify-center gap-4 text-wood-700">
          <TreePine className="size-12" strokeWidth={1.2} />
          <Compass className="size-10" strokeWidth={1.4} />
          <TreePine className="size-14" strokeWidth={1.2} />
        </div>
        <Mono className="mt-6 text-wood-600">Erreur 404</Mono>
        <H1 className="mt-2">Perdu dans la forêt ?</H1>
        <Body className="mt-3 mx-auto max-w-md text-muted-foreground">
          La page que vous cherchez n&apos;existe plus, ou n&apos;a jamais
          existé. Reprenons le chemin depuis le début.
        </Body>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={routes.home}
            className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href={routes.catalog}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Voir le catalogue
          </Link>
        </div>
      </div>
    </main>
  );
}
