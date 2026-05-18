"use client";

import * as React from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Body, H1, Mono } from "@/components/ui/typography";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Surface unexpected errors to the console for debugging; in production we'd
  // forward to Sentry/Logflare via the digest.
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-ember/10 text-ember">
        <TriangleAlert className="size-7" strokeWidth={1.5} />
      </span>
      <Mono className="mt-4 text-wood-600">Erreur inattendue</Mono>
      <H1 className="mt-2">Quelque chose s&apos;est mal passé</H1>
      <Body className="mt-3 max-w-md text-muted-foreground">
        Nous avons enregistré le problème. Réessayez dans quelques secondes —
        si l&apos;erreur persiste, contactez notre support.
      </Body>
      {error.digest ? (
        <p className="mt-3 font-mono text-2xs text-muted-foreground">
          Référence : {error.digest}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" variant="primary" size="lg" onClick={reset}>
          Réessayer
        </Button>
        <Link
          href={routes.contact}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Contacter le support
        </Link>
      </div>
    </section>
  );
}
