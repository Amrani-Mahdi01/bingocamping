import * as React from "react";
import type { Metadata } from "next";

import { Body, H1, Lead, Mono } from "@/components/ui/typography";
import { PineDivider } from "@/components/decorative/PineDivider";

export interface StaticPageShellProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}

export function StaticPageShell({
  eyebrow,
  title,
  lead,
  children,
}: StaticPageShellProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <header className="text-center">
        {eyebrow ? <Mono className="text-wood-600">{eyebrow}</Mono> : null}
        <H1 className="mt-3">{title}</H1>
        {lead ? <Lead className="mx-auto mt-4 max-w-2xl">{lead}</Lead> : null}
      </header>
      <PineDivider className="my-10" />
      <div className="space-y-10">{children}</div>
    </article>
  );
}

export function StaticSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function staticMetadata(
  title: string,
  description: string
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} — BINGO`,
      description,
    },
  };
}

/** Re-export Body so consumers don't need a second import. */
export { Body };
