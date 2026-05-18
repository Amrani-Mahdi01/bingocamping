import * as React from "react";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import {
  Body,
  H1,
  H2,
  H3,
  H4,
  Lead,
  Mono,
  Small,
} from "@/components/ui/typography";

import { WoodGrainPattern } from "@/components/decorative/WoodGrainPattern";
import { TopoLines } from "@/components/decorative/TopoLines";
import { PineDivider } from "@/components/decorative/PineDivider";

export const metadata: Metadata = {
  title: "Design system",
  description:
    "Tokens, primitives et composants décoratifs de l'écosystème BINGO. Route de QA — non liée à la navigation publique.",
  robots: { index: false, follow: false },
};

/* -----------------------------------------------------------
   Token data
   ----------------------------------------------------------- */

const FOREST = [
  { name: "forest-50", hex: "#f3f6f3" },
  { name: "forest-100", hex: "#e3ebe4" },
  { name: "forest-200", hex: "#c7d7c9" },
  { name: "forest-300", hex: "#9bb89f" },
  { name: "forest-400", hex: "#6a9270" },
  { name: "forest-500", hex: "#477352" },
  { name: "forest-600", hex: "#345b3f" },
  { name: "forest-700", hex: "#215728", note: "Brand green" },
  { name: "forest-800", hex: "#1a3f20" },
  { name: "forest-900", hex: "#142e19" },
  { name: "forest-950", hex: "#0a1a0d" },
];

const WOOD = [
  { name: "wood-50", hex: "#fbf6f1" },
  { name: "wood-100", hex: "#f4e8db" },
  { name: "wood-200", hex: "#e8cfb4" },
  { name: "wood-300", hex: "#d9af86" },
  { name: "wood-400", hex: "#c88a58" },
  { name: "wood-500", hex: "#a96535" },
  { name: "wood-600", hex: "#803e15", note: "Brand brown" },
  { name: "wood-700", hex: "#6a3411" },
  { name: "wood-800", hex: "#562c10" },
  { name: "wood-900", hex: "#48260f" },
];

const NEUTRALS = [
  { name: "cream", hex: "#faf6ef", note: "Page bg" },
  { name: "parchment", hex: "#f1ead9", note: "Card bg" },
  { name: "ink", hex: "#1c1a14", note: "Text" },
  { name: "moss", hex: "#7a8b5a" },
  { name: "ember", hex: "#c4441f", note: "Sale price / low stock" },
];

const TYPE_SCALE = [
  { px: 12, cls: "text-2xs", label: "Caption" },
  { px: 14, cls: "text-xs", label: "Small" },
  { px: 16, cls: "text-sm", label: "Body" },
  { px: 18, cls: "text-base", label: "Body lead" },
  { px: 20, cls: "text-md", label: "Lead / Price" },
  { px: 24, cls: "text-lg", label: "H4 / Subhead" },
  { px: 32, cls: "text-xl", label: "H3" },
  { px: 40, cls: "text-2xl", label: "H2" },
  { px: 56, cls: "text-3xl", label: "H1" },
  { px: 72, cls: "text-4xl", label: "Display XL" },
];

/* -----------------------------------------------------------
   Section helper
   ----------------------------------------------------------- */

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <div>
        <Mono>{id}</Mono>
        <H2 className="mt-1">{title}</H2>
        {description ? <Lead className="mt-2">{description}</Lead> : null}
      </div>
      {children}
    </section>
  );
}

function SwatchCard({
  name,
  hex,
  note,
  dark,
}: {
  name: string;
  hex: string;
  note?: string;
  dark?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-wood-600/10 shadow-sm">
      <div
        className="h-20 w-full"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <div
        className={`flex flex-col gap-0.5 p-3 ${
          dark ? "bg-forest-950 text-cream" : "bg-cream text-ink"
        }`}
      >
        <Mono className={dark ? "text-wood-200" : "text-wood-700"}>
          {name}
        </Mono>
        <span className="font-mono text-xs">{hex}</span>
        {note ? (
          <Small className={dark ? "text-cream/70" : "text-muted-foreground"}>
            {note}
          </Small>
        ) : null}
      </div>
    </div>
  );
}

/* -----------------------------------------------------------
   Page
   ----------------------------------------------------------- */

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      {/* Header */}
      <header className="relative overflow-hidden rounded-lg bg-cream p-8 sm:p-12">
        <TopoLines opacity={0.75} />
        <div className="relative">
          <Mono className="text-wood-600">QA · interne</Mono>
          <H1 className="mt-2">Design system</H1>
          <Lead className="mt-3 max-w-xl">
            Tokens, primitives et composants décoratifs de BINGO. Cette route
            existe pour la revue qualité et n&apos;est jamais liée depuis la
            navigation publique.
          </Lead>
          <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {[
              ["Couleurs", "color"],
              ["Typographie", "type"],
              ["Boutons", "buttons"],
              ["Badges", "badges"],
              ["Formulaires", "forms"],
              ["Décoratifs", "decor"],
              ["Ombres", "shadows"],
            ].map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-xs font-medium uppercase tracking-wide text-wood-700 hover:text-forest-700"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <PineDivider />

      {/* Colour swatches */}
      <Section
        id="color"
        title="Couleurs"
        description="Forest pour les actions et les surfaces foncées. Wood pour les accents chauds. Cream est l'arrière-plan — jamais blanc pur."
      >
        <div>
          <H3 className="mb-3">Forest</H3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {FOREST.map((c) => (
              <SwatchCard key={c.name} {...c} />
            ))}
          </div>
        </div>
        <div>
          <H3 className="mb-3 mt-8">Wood</H3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {WOOD.map((c) => (
              <SwatchCard key={c.name} {...c} />
            ))}
          </div>
        </div>
        <div>
          <H3 className="mb-3 mt-8">Neutres &amp; accents</H3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {NEUTRALS.map((c) => (
              <SwatchCard key={c.name} {...c} />
            ))}
          </div>
        </div>
      </Section>

      <PineDivider />

      {/* Typography */}
      <Section
        id="type"
        title="Typographie"
        description="Fraunces (display, serif variable) pour les titres. Inter (body) pour le texte courant. JetBrains Mono pour les valeurs techniques et les badges."
      >
        <div className="space-y-5 rounded-md bg-parchment p-6">
          {TYPE_SCALE.map((t) => (
            <div
              key={t.px}
              className="flex flex-wrap items-baseline gap-4 border-b border-wood-400/20 pb-3 last:border-0 last:pb-0"
            >
              <Mono className="w-20 shrink-0 text-wood-700">{t.px}px</Mono>
              <Small className="w-28 shrink-0">{t.label}</Small>
              <span
                className={`font-display leading-[1.15] tracking-[-0.02em] ${t.cls}`}
              >
                Aventure
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md bg-parchment p-6">
            <H4 className="mb-3">Composants display</H4>
            <H1>L&apos;aventure commence ici</H1>
            <H2 className="mt-3">Explorer par catégorie</H2>
            <H3 className="mt-3">Tentes &amp; abris</H3>
            <H4 className="mt-3">Caractéristiques techniques</H4>
          </div>
          <div className="rounded-md bg-parchment p-6">
            <H4 className="mb-3">Composants body</H4>
            <Lead>
              Une sélection rigoureuse d&apos;équipement outdoor — testé en
              conditions réelles, livré dans toute l&apos;Algérie.
            </Lead>
            <Body className="mt-4">
              Body — utilisé pour les paragraphes courants, descriptions
              produit, contenu éditorial. Hauteur de ligne 1.6 pour la
              lisibilité.
            </Body>
            <Small className="mt-4 block">
              Small — métadonnées, légendes, mentions secondaires.
            </Small>
            <div className="mt-4">
              <Mono>SKU · BIN-2026-00042</Mono>
            </div>
          </div>
        </div>
      </Section>

      <PineDivider />

      {/* Buttons */}
      <Section
        id="buttons"
        title="Boutons"
        description="Variantes et tailles. La variante secondary affiche la trame bois (WoodGrainPattern) en superposition."
      >
        <div className="rounded-md bg-parchment p-6">
          <H4 className="mb-4">Variantes</H4>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>

          <H4 className="mb-4 mt-8">Tailles</H4>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="default">
              Default
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
            <Button variant="primary" size="icon" aria-label="Action">
              +
            </Button>
          </div>

          <H4 className="mb-4 mt-8">États</H4>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Default</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </Section>

      <PineDivider />

      {/* Badges */}
      <Section
        id="badges"
        title="Badges"
        description="Variantes sémantiques pour étiquettes, statuts et notifications."
      >
        <div className="flex flex-wrap items-center gap-3 rounded-md bg-parchment p-6">
          <Badge variant="primary">NOUVEAU</Badge>
          <Badge variant="secondary">PROMO</Badge>
          <Badge variant="success">EN STOCK</Badge>
          <Badge variant="warning">STOCK FAIBLE</Badge>
          <Badge variant="destructive">RUPTURE</Badge>
          <Badge variant="outline">SOLDÉ</Badge>
          <Badge variant="ghost">Brouillon</Badge>
        </div>
      </Section>

      <PineDivider />

      {/* Form inputs */}
      <Section
        id="forms"
        title="Champs de formulaire"
        description="Inputs, textareas, selects et checkboxes. Tous utilisent les tokens de la marque."
      >
        <div className="grid gap-4 rounded-md bg-parchment p-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ds-email">Adresse email</Label>
            <Input id="ds-email" type="email" placeholder="vous@bingo.dz" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ds-phone">Téléphone</Label>
            <Input id="ds-phone" placeholder="+213 6XX XXX XXX" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="ds-message">Message</Label>
            <Textarea
              id="ds-message"
              rows={4}
              placeholder="Comment pouvons-nous vous aider ?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ds-wilaya">Wilaya</Label>
            <Select>
              <SelectTrigger id="ds-wilaya">
                <SelectValue placeholder="Sélectionner une wilaya" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16">Alger</SelectItem>
                <SelectItem value="19">Sétif</SelectItem>
                <SelectItem value="31">Oran</SelectItem>
                <SelectItem value="25">Constantine</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 pt-7">
            <Checkbox id="ds-cgv" />
            <Label htmlFor="ds-cgv" className="font-normal">
              J&apos;accepte les conditions générales
            </Label>
          </div>
        </div>
      </Section>

      <PineDivider />

      {/* Decorative components */}
      <Section
        id="decor"
        title="Composants décoratifs"
        description="WoodGrainPattern doit être visible sur toute surface wood-600 plus grande qu'un bouton."
      >
        <div className="space-y-6">
          <div>
            <H4 className="mb-3">WoodGrainPattern — opacités</H4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[0.05, 0.1, 0.15, 0.2].map((op) => (
                <div
                  key={op}
                  className="wood-grain relative h-32 overflow-hidden rounded-md bg-wood-600 text-cream"
                >
                  <WoodGrainPattern opacity={op} seed={`ds-${op}`} />
                  <div className="relative flex h-full flex-col justify-end p-3">
                    <Mono className="text-cream/80">
                      {(op * 100).toFixed(0)}% opacity
                    </Mono>
                  </div>
                </div>
              ))}
            </div>
            <Small className="mt-3 block">
              Spec: 8-12% recommandé pour les surfaces. Valeurs supplémentaires
              affichées pour comparaison.
            </Small>
          </div>

          <div>
            <H4 className="mb-3">TopoLines</H4>
            <div className="relative h-40 overflow-hidden rounded-md bg-cream">
              <TopoLines />
              <div className="relative flex h-full items-center justify-center">
                <Mono className="text-wood-700">
                  Hero background — forest-100 sur cream
                </Mono>
              </div>
            </div>
          </div>

          <div>
            <H4 className="mb-3">PineDivider</H4>
            <div className="rounded-md bg-cream p-2">
              <PineDivider />
            </div>
          </div>
        </div>
      </Section>

      <PineDivider />

      {/* Shadows */}
      <Section
        id="shadows"
        title="Ombres"
        description="Ombres douces tintées d'ink. Jamais de noir pur."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { name: "shadow-sm", cls: "shadow-sm" },
            { name: "shadow-md", cls: "shadow-md" },
            { name: "shadow-lg", cls: "shadow-lg" },
          ].map((s) => (
            <div
              key={s.name}
              className={`flex h-32 items-center justify-center rounded-md bg-parchment ${s.cls}`}
            >
              <Mono>{s.name}</Mono>
            </div>
          ))}
        </div>
      </Section>

      <Separator className="my-12" />

      <footer className="text-center">
        <Small>
          BINGO design system — Phase 1. Voir{" "}
          <span className="font-mono">_docs/DESIGN_SYSTEM.md</span> pour la
          spec complète.
        </Small>
      </footer>
    </main>
  );
}
