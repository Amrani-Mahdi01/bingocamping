import * as React from "react";

import {
  StaticPageShell,
  StaticSection,
  staticMetadata,
} from "@/components/layout/StaticPageShell";
import { Mono } from "@/components/ui/typography";
import { T } from "@/components/i18n/T";
import type { TranslationKey } from "@/lib/i18n/dictionary";

export const metadata = staticMetadata(
  "Conditions générales de vente",
  "CGV régissant les achats sur BINGO — Algérie."
);

interface Article {
  titleKey: TranslationKey;
  body: React.ReactNode;
}

const ARTICLES: Article[] = [
  {
    titleKey: "cgv.art1.title",
    body: (
      <>
        <p>
          <T k="cgv.art1.p1" />
        </p>
        <p>
          <strong>
            <T k="cgv.art1.p2.bold" />
          </strong>{" "}
          <T k="cgv.art1.p2.text" />
        </p>
        <p>
          <T k="cgv.art1.p3" />
        </p>
      </>
    ),
  },
  {
    titleKey: "cgv.art2.title",
    body: (
      <p>
        <T k="cgv.art2.p1" />
      </p>
    ),
  },
  {
    titleKey: "cgv.art3.title",
    body: (
      <>
        <p>
          <T k="cgv.art3.p1" />
        </p>
        <p>
          <T k="cgv.art3.p2" />
        </p>
      </>
    ),
  },
  {
    titleKey: "cgv.art4.title",
    body: (
      <p>
        <T k="cgv.art4.p1" />
      </p>
    ),
  },
  {
    titleKey: "cgv.art5.title",
    body: (
      <p>
        <T k="cgv.art5.p1" />
      </p>
    ),
  },
  {
    titleKey: "cgv.art6.title",
    body: (
      <p>
        <T k="cgv.art6.p1" />
      </p>
    ),
  },
  {
    titleKey: "cgv.art7.title",
    body: (
      <p>
        <T k="cgv.art7.p1" />
      </p>
    ),
  },
  {
    titleKey: "cgv.art8.title",
    body: (
      <p>
        <T k="cgv.art8.p1.before" />{" "}
        <em>
          <T k="cgv.art8.p1.em" />
        </em>{" "}
        <T k="cgv.art8.p1.after" />
      </p>
    ),
  },
  {
    titleKey: "cgv.art9.title",
    body: (
      <p>
        <T k="cgv.art9.p1" />
      </p>
    ),
  },
  {
    titleKey: "cgv.art10.title",
    body: (
      <p>
        <T k="cgv.art10.p1" />
      </p>
    ),
  },
  {
    titleKey: "cgv.art11.title",
    body: (
      <p>
        <T k="cgv.art11.p1" />
      </p>
    ),
  },
  {
    titleKey: "cgv.art12.title",
    body: (
      <p>
        <T k="cgv.art12.p1" />
      </p>
    ),
  },
];

export default function CgvPage() {
  return (
    <StaticPageShell
      eyebrow={<T k="info.cgv.eyebrow" />}
      title={<T k="info.cgv.title" />}
    >
      {ARTICLES.map((a) => (
        <StaticSection key={a.titleKey} title={<T k={a.titleKey} />}>
          {a.body}
        </StaticSection>
      ))}

      <div className="rounded-lg bg-parchment p-5 text-center">
        <Mono className="text-wood-600">
          <T k="cgv.updated.label" />
        </Mono>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          <T k="cgv.updated.date" />
        </p>
      </div>
    </StaticPageShell>
  );
}
