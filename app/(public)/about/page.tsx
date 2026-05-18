import * as React from "react";
import Link from "next/link";
import { Award, Compass, Headphones, ShieldCheck } from "lucide-react";

import { TopoLines } from "@/components/decorative/TopoLines";
import {
  StaticPageShell,
  StaticSection,
  staticMetadata,
} from "@/components/layout/StaticPageShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Mono, Small } from "@/components/ui/typography";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const metadata = staticMetadata(
  "À propos",
  "BINGO — équipement outdoor en Algérie, sélection rigoureuse, livraison ZR Express partout dans le pays."
);

const VALUES = [
  {
    icon: Compass,
    title: "Curation",
    text: "Moins de marques, mieux choisies. Nous écartons les gadgets et privilégions ce qui résiste au temps.",
  },
  {
    icon: Award,
    title: "Qualité",
    text: "Tests terrain dans le Djurdjura, l'Aurès et le Hoggar avant toute mise en catalogue.",
  },
  {
    icon: Headphones,
    title: "Service",
    text: "Conseil par téléphone et WhatsApp 7j/7. Le SAV traite chaque demande sous 24h.",
  },
];

const TEAM = [
  { name: "Yacine Benali", role: "Fondateur" },
  { name: "Amina Khelifi", role: "Responsable produit" },
  { name: "Karim Mokrane", role: "Service client" },
  { name: "Sofia Belaid", role: "Logistique & SAV" },
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
          <Mono className="text-cream/70">Notre maison</Mono>
          <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            BINGO — L&apos;aventure commence ici
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-cream/85">
            Une petite équipe à Sétif, une obsession : équiper sérieusement
            celles et ceux qui sortent — pour une nuit ou pour un mois.
          </p>
        </div>
      </section>

      <StaticPageShell eyebrow="Notre histoire" title="Une obsession outdoor née à Sétif">
        <StaticSection title="Pourquoi BINGO ?">
          <p>
            BINGO est né d&apos;une frustration simple : impossible de trouver
            en Algérie un équipement outdoor à la fois technique, durable et
            accompagné d&apos;un vrai service client. Trop de boutiques
            vendent ce qui se vend, pas ce qui dure.
          </p>
          <p>
            Nous avons commencé en 2024 par sélectionner moins de quinze
            marques, parmi des fabricants qui partagent notre approche : pas
            de greenwashing, pas de marketing creux, des matériaux honnêtes
            et un SAV qui répond vraiment.
          </p>
        </StaticSection>

        <StaticSection title="Notre approche">
          <p>
            Chaque produit est testé en conditions réelles avant d&apos;entrer
            au catalogue. Nous prêtons attention à trois choses : la
            durabilité (combien de saisons tiendra-t-il&nbsp;?), la réparabilité
            (peut-on remplacer une pièce&nbsp;?) et la transparence des fiches
            techniques.
          </p>
          <p>
            Côté logistique, nous travaillons en exclusivité avec ZR Express
            — leur réseau couvre les 58 wilayas et leur taux de livraison
            réussie est le plus élevé d&apos;Algérie. Tout le monde est livré.
          </p>
        </StaticSection>

        {/* Values */}
        <section className="grid gap-4 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg bg-parchment p-5">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-wood-100 text-wood-700">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-md font-semibold text-ink">
                {title}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>

        {/* Team */}
        <section>
          <h2 className="font-display text-xl font-semibold text-ink">
            Notre équipe
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Une petite équipe à Sétif. Vous nous trouvez par téléphone ou
            WhatsApp pendant les heures de bureau.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <li
                key={m.name}
                className="flex flex-col items-center rounded-lg bg-parchment p-5 text-center"
              >
                <Avatar className="size-16 border border-wood-600/20">
                  <AvatarFallback className="bg-wood-600 text-cream">
                    {m.name
                      .split(" ")
                      .map((s) => s[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <p className="mt-3 font-display text-sm font-semibold text-ink">
                  {m.name}
                </p>
                <Small>{m.role}</Small>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg bg-forest-900 p-8 text-center text-cream">
          <ShieldCheck className="mx-auto size-8 text-wood-300" />
          <p className="mt-4 font-display text-xl">
            La meilleure publicité, c&apos;est un client servi correctement.
          </p>
          <Link
            href={routes.catalog}
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "mt-6"
            )}
          >
            Découvrir nos produits
          </Link>
        </section>
      </StaticPageShell>
    </>
  );
}
