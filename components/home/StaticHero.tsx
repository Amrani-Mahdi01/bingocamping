import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Mono } from "@/components/ui/typography";
import { routes } from "@/lib/routes";

/**
 * Single-image hero. Replaces the rotating BannerSlider with one static
 * photograph (camper by the fire at dusk) and a centred copy stack.
 */
export function StaticHero() {
  return (
    <section
      aria-label="BINGO — équipement outdoor"
      className="relative overflow-hidden bg-forest-950"
    >
      <div className="relative h-[380px] sm:h-[440px] md:h-[520px] lg:h-[600px] xl:h-[640px]">
        <Image
          src="/editorial/curation-outdoor.jpg"
          alt="Feu de camp au crépuscule — équipement BINGO"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Scrims — darker at the bottom + soft vignette so centred text reads
            without flattening the image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-forest-950/55 via-forest-950/45 to-forest-950/80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,transparent_0%,rgba(11,28,17,0.55)_70%)]"
        />

        {/* Centred copy */}
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
          <div className="max-w-2xl text-center text-cream">
            <Mono className="text-tangerine-300">Depuis 2026 · Sétif, DZ</Mono>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-[1.04] tracking-[-0.025em] sm:text-5xl md:text-6xl lg:text-7xl">
              Conçu pour le long chemin.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/85 sm:text-base md:text-lg">
              Du matériel honnête pour les nuits du week-end et les longues
              traversées. Testé dans le Djurdjura et l&apos;Atlas, prêt pour
              partout.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
              <Link
                href={routes.catalog}
                className="inline-flex items-center gap-2 rounded-full bg-tangerine-500 px-6 py-3 font-display text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-tangerine-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tangerine-300 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-900 sm:px-7"
              >
                Voir le catalogue
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={routes.about}
                className="inline-flex items-center rounded-full border border-cream/35 bg-forest-950/30 px-6 py-3 font-display text-sm font-semibold text-cream backdrop-blur transition-colors hover:border-cream/60 hover:bg-forest-950/55 sm:px-7"
              >
                Notre histoire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
