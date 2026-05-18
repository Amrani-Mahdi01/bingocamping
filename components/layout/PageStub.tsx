import * as React from "react";
import { Body, H1, Mono } from "@/components/ui/typography";
import { PineDivider } from "@/components/decorative/PineDivider";

interface PageStubProps {
  /** Route label shown in mono uppercase (e.g. "Catalogue"). */
  title: string;
  /** One-line French description of what will live here. */
  description: string;
  /** Phase number that will replace this stub (3-9 typically). */
  phase?: number;
  /** Optional path label rendered above the title. */
  pathHint?: string;
}

/**
 * Placeholder rendered by every Phase 2 stub route. Each stub is a single
 * heading + one-line description per the phase brief — wrapped in a small
 * card so the layout shells (Header/Footer/Sidebar) are still legible while
 * the page content is empty.
 */
export function PageStub({
  title,
  description,
  phase,
  pathHint,
}: PageStubProps) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 text-center sm:py-24">
      {pathHint ? (
        <Mono className="text-wood-600">{pathHint}</Mono>
      ) : null}
      <H1 className="mt-3">{title}</H1>
      <PineDivider className="my-6 max-w-md" />
      <Body className="max-w-xl text-muted-foreground">{description}</Body>
      {phase ? (
        <p className="mt-6 inline-block rounded-md bg-parchment px-3 py-1.5 font-mono text-2xs uppercase tracking-wide text-wood-700">
          Sera construit en phase {phase}
        </p>
      ) : null}
    </section>
  );
}
