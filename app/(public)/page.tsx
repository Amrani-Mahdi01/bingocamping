import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Mono } from "@/components/ui/typography";
import { ProductCard } from "@/components/product/ProductCard";
import { BannerSlider } from "@/components/home/BannerSlider";
import { CategoryTile } from "@/components/home/CategoryTile";
import { SectionHeader } from "@/components/home/SectionHeader";
import { SpotlightReel } from "@/components/home/SpotlightReel";
import { StaticHero } from "@/components/home/StaticHero";
import { TrustBand } from "@/components/home/TrustBand";
import { ImageDivider } from "@/components/decorative/ImageDivider";
import { ScrollReveal } from "@/components/decorative/ScrollReveal";
import { api } from "@/lib/api/client";
import { routes } from "@/lib/routes";

export const revalidate = 60;

export default async function HomePage() {
  const [banners, allCategories, featured, news, promos, best] =
    await Promise.all([
      api.banners.list(),
      api.categories.list(),
      api.products.getFeatured(),
      api.products.getNew(),
      api.products.getPromotions(),
      api.products.getBestSellers(),
    ]);

  const topCats = allCategories.filter((c) => !c.parentId).slice(0, 8);

  return (
    <>
      {/* 0. Spotlight reel — promos + new + collections (top of page) */}
      <SpotlightReel
        promoProducts={promos.slice(0, 3)}
        newProducts={news.slice(0, 3)}
        highlightedCategories={topCats.slice(0, 2)}
      />

      {/* 1. Hero — single static image with centred copy.
            The legacy BannerSlider stays imported so banners data is still
            consumed by the build, but it's hidden until we decide to bring it
            back. */}
      <StaticHero />
      <div hidden aria-hidden="true">
        <BannerSlider banners={banners} />
      </div>

      {/* 2. Trust band */}
      <TrustBand />

      {/* 3. Categories — cream */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeader
            eyebrow="Explorez"
            title="Trouvez votre équipement par catégorie"
            lead="Huit univers couvrant tout l'outdoor — du bivouac à la randonnée technique."
            ctaLabel="Voir le catalogue complet"
            ctaHref={routes.catalog}
          />
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {topCats.map((cat, i) => (
                <CategoryTile
                  key={cat.id}
                  slug={cat.slug}
                  name={cat.name}
                  productCount={cat.productCount}
                  icon={cat.icon}
                  index={i}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. Featured */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeader
            eyebrow="Sélection BINGO"
            title="Produits vedettes"
            lead="Notre coup de cœur du moment — testés sur le terrain par l'équipe."
            ctaLabel="Tout voir"
            ctaHref={routes.catalog}
          />
          <ScrollReveal delay={80}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>


      <ImageDivider
        src="/dividers/road-mountains.jpg"
        quote="L'aventure commence là où s'arrête la route."
        attribution="Manifeste BINGO"
      />

      {/* 5. New arrivals — cream */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeader
            eyebrow="Récemment ajoutés"
            title="Nouveautés"
            lead="Les dernières arrivées du catalogue."
            ctaLabel="Toutes les nouveautés"
            ctaHref={`${routes.catalog}?sort=new`}
          />
          <ScrollReveal delay={80}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {news.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ImageDivider
        src="/hero/lake-campfire.jpg"
        quote="Le meilleur équipement est celui qui ne se voit pas."
        attribution="Manifeste BINGO"
      />

      {/* 6. Promotions */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeader
            eyebrow="Profitez-en"
            title="Promotions en cours"
            lead="Sélection à prix réduit, dans la limite des stocks disponibles."
            ctaLabel="Toutes les promotions"
            ctaHref={`${routes.catalog}?promoOnly=true`}
          />
          <ScrollReveal delay={80}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {promos.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ImageDivider
        src="/dividers/camp-view.jpg"
        quote="Loin de tout, près de l'essentiel."
        attribution="Manifeste BINGO"
      />

      {/* 7. Best sellers — cream */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeader
            eyebrow="Plébiscités par nos clients"
            title="Meilleures ventes"
            ctaLabel="Tous les best-sellers"
            ctaHref={`${routes.catalog}?sort=popular`}
          />
          <ScrollReveal delay={80}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {best.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. Editorial */}
      <section className="relative overflow-hidden bg-forest-900 text-cream">
        {/* ───── Decorative SVG backdrop ───── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {/* Starfield dot pattern */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(249,173,101,0.22) 1px, transparent 1.4px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Top-right topographic concentric rings */}
          <svg
            viewBox="0 0 600 600"
            fill="none"
            className="absolute -right-40 -top-40 size-[680px] text-tangerine-300 opacity-[0.10]"
          >
            {[180, 220, 260, 300, 340, 380, 420, 460, 500].map((r) => (
              <circle
                key={r}
                cx="300"
                cy="300"
                r={r}
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ))}
          </svg>

          {/* Bottom-left wavy contour lines */}
          <svg
            viewBox="0 0 700 280"
            fill="none"
            preserveAspectRatio="none"
            className="absolute -bottom-10 -left-12 h-72 w-[720px] text-cream opacity-[0.08]"
          >
            {[0, 18, 36, 56, 78, 102].map((dy, i) => (
              <path
                key={i}
                d={`M -20 ${140 + dy} Q 120 ${100 + dy} 250 ${135 + dy} T 520 ${130 + dy} T 820 ${140 + dy}`}
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ))}
          </svg>

          {/* Soft tangerine radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_28%,rgba(234,108,29,0.10),transparent_60%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 md:grid-cols-2 md:items-center md:gap-16">
          <ScrollReveal>
            <div className="relative aspect-[5/6] overflow-hidden rounded-2xl md:aspect-[4/5]">
              <Image
                src="/editorial/curation-outdoor.jpg"
                alt="Feu de camp au crépuscule — notre approche de la curation outdoor"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Image filters — gradient scrim + forest wash + inner edge */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-transparent to-forest-950/35"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-forest-900/20 mix-blend-multiply"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-cream/10"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="max-w-md">
              <Mono className="text-tangerine-300">Notre approche</Mono>
              <h2 className="mt-3 font-display text-xl leading-[1.1] tracking-[-0.02em] sm:mt-4 sm:text-4xl">
                L&apos;équipement, sans bruit.
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-cream/80 sm:mt-5 sm:text-base">
                Chaque produit est testé sur le terrain — Djurdjura, Hoggar,
                Aurès. Nous travaillons avec un petit nombre de marques
                choisies pour leur durabilité, leur honnêteté technique et
                leur SAV. Pas de gadgets, pas de marketing creux.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-cream/80 sm:mt-4 sm:text-base">
                Juste ce qui marche, livré partout en Algérie par ZR Express.
              </p>
              <Link
                href={routes.about}
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-cream/30 px-4 py-2 font-display text-xs font-semibold text-cream transition-colors hover:border-tangerine-400 hover:text-tangerine-300 sm:mt-8 sm:px-6 sm:py-3 sm:text-sm"
              >
                Lire notre histoire
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 9. Catalogue CTA */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <ScrollReveal>
            <Mono className="text-tangerine-600">Tout le catalogue</Mono>
            <h2 className="mt-3 font-display text-2xl leading-[1.1] tracking-[-0.02em] text-ink sm:text-3xl">
              Découvrez tous nos produits
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Plus de références à explorer — tentes, sacs, chaussures,
              éclairage et bien plus. Livraison ZR Express partout en Algérie.
            </p>
            <Link
              href={routes.catalog}
              className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-tangerine-500 px-8 font-display text-sm font-semibold text-cream transition-all hover:bg-tangerine-600 hover:scale-[1.02]"
            >
              Voir nos produits
              <ArrowRight className="size-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
