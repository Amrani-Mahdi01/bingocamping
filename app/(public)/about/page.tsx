import * as React from "react";
import Link from "next/link";
import { Award, Compass, Headphones, ShieldCheck } from "lucide-react";

import { TopoLines } from "@/components/decorative/TopoLines";
import {
  StaticPageShell,
  StaticSection,
  staticMetadata,
} from "@/components/layout/StaticPageShell";
import { buttonVariants } from "@/components/ui/button";
import { Mono } from "@/components/ui/typography";
import { T } from "@/components/i18n/T";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const metadata = staticMetadata(
  "À propos",
  "BINGO — équipement outdoor en Algérie, sélection rigoureuse, livraison ZR Express partout dans le pays."
);

const VALUES: {
  icon: typeof Compass;
  titleKey: TranslationKey;
  textKey: TranslationKey;
}[] = [
  {
    icon: Compass,
    titleKey: "about.values.curation.title",
    textKey: "about.values.curation.text",
  },
  {
    icon: Award,
    titleKey: "about.values.quality.title",
    textKey: "about.values.quality.text",
  },
  {
    icon: Headphones,
    titleKey: "about.values.service.title",
    textKey: "about.values.service.text",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-forest-700 text-cream">
        <TopoLines
          opacity={0.35}
          stroke="rgba(250,246,239,0.4)"
          className="opacity-100"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-24">
          <Mono className="text-cream/70">
            <T k="about.hero.eyebrow" />
          </Mono>
          <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            <T k="about.hero.title" />
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-cream/85">
            <T k="about.hero.lead" />
          </p>
        </div>
      </section>

      <StaticPageShell
        eyebrow={<T k="info.about.eyebrow" />}
        title={<T k="info.about.title" />}
      >
        <StaticSection title={<T k="about.section.why.title" />}>
          <p>
            <T k="about.section.why.p1" />
          </p>
          <p>
            <T k="about.section.why.p2" />
          </p>
        </StaticSection>

        <StaticSection title={<T k="about.section.approach.title" />}>
          <p>
            <T k="about.section.approach.p1" />
          </p>
          <p>
            <T k="about.section.approach.p2" />
          </p>
        </StaticSection>

        {/* Values */}
        <section className="grid gap-4 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, titleKey, textKey }) => (
            <div key={titleKey} className="rounded-lg bg-parchment p-5">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-wood-100 text-wood-700">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-md font-semibold text-ink">
                <T k={titleKey} />
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                <T k={textKey} />
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-lg bg-forest-900 p-8 text-center text-cream">
          <ShieldCheck className="mx-auto size-8 text-wood-300" />
          <p className="mt-4 font-display text-xl">
            <T k="about.banner.quote" />
          </p>
          <Link
            href={routes.catalog}
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "mt-6"
            )}
          >
            <T k="about.banner.cta" />
          </Link>
        </section>
      </StaticPageShell>
    </>
  );
}
