"use client";

import * as React from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Body, H1, Mono } from "@/components/ui/typography";
import { useT } from "@/lib/i18n/LanguageProvider";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-ember/10 text-ember">
        <TriangleAlert className="size-7" strokeWidth={1.5} />
      </span>
      <Mono className="mt-4 text-wood-600">{t("error.eyebrow")}</Mono>
      <H1 className="mt-2">{t("error.title")}</H1>
      <Body className="mt-3 max-w-md text-muted-foreground">
        {t("error.lead")}
      </Body>
      {error.digest ? (
        <p className="mt-3 font-mono text-2xs text-muted-foreground">
          {t("error.reference")} : {error.digest}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" variant="primary" size="lg" onClick={reset}>
          {t("error.retry")}
        </Button>
        <Link
          href={routes.contact}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          {t("error.contact")}
        </Link>
      </div>
    </section>
  );
}
