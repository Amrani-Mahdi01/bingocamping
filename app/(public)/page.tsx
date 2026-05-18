import Image from "next/image";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Mono } from "@/components/ui/typography";
import { ProductCard } from "@/components/product/ProductCard";
import { BannerSlider } from "@/components/home/BannerSlider";
import { CategoryTile } from "@/components/home/CategoryTile";
import { SectionHeader } from "@/components/home/SectionHeader";
import { TrustBand } from "@/components/home/TrustBand";
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
      {/* 1. Hero — promo carousel */}
      <BannerSlider banners={banners} />

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

      {/* 4. Featured — parchment */}
      <section className="bg-parchment">
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
              {news.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. Promotions — anchored on a confident wood-200 panel */}
      <section className="relative overflow-hidden bg-wood-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(234,108,29,0.12),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeader
            eyebrow="Profitez-en"
            title="Promotions en cours"
            lead="Sélection à prix réduit, dans la limite des stocks disponibles."
            ctaLabel="Toutes les promotions"
            ctaHref={`${routes.catalog}?promoOnly=true`}
          />
          <ScrollReveal delay={80}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {promos.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

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
      <section className="bg-forest-900 text-cream">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 md:grid-cols-2 md:items-center md:gap-16">
          <ScrollReveal>
            <div className="relative aspect-[5/6] overflow-hidden rounded-2xl md:aspect-[4/5]">
              <Image
                src="/api/placeholder/900/1080/Curation-outdoor"
                alt="Notre approche de la curation outdoor"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="max-w-md">
              <Mono className="text-tangerine-300">Notre approche</Mono>
              <h2 className="mt-4 font-display text-3xl leading-[1.1] tracking-[-0.02em] sm:text-4xl">
                L&apos;équipement, sans bruit.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-cream/80">
                Chaque produit est testé sur le terrain — Djurdjura, Hoggar,
                Aurès. Nous travaillons avec un petit nombre de marques
                choisies pour leur durabilité, leur honnêteté technique et
                leur SAV. Pas de gadgets, pas de marketing creux.
              </p>
              <p className="mt-4 text-base leading-relaxed text-cream/80">
                Juste ce qui marche, livré partout en Algérie par ZR Express.
              </p>
              <Link
                href={routes.about}
                className="mt-8 inline-flex items-center gap-2 rounded-md border border-cream/30 px-6 py-3 font-display text-sm font-semibold text-cream transition-colors hover:border-tangerine-400 hover:text-tangerine-300"
              >
                Lire notre histoire
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 9. Newsletter — soft tangerine tint */}
      <section className="bg-tangerine-50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <ScrollReveal>
            <Mono className="text-tangerine-600">Restez informé</Mono>
            <h2 className="mt-3 font-display text-2xl leading-[1.1] tracking-[-0.02em] text-ink sm:text-3xl">
              Recevez nos nouveautés
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Une lettre par mois — nouveautés, conseils techniques et offres
              exclusives. Pas de spam.
            </p>
            <form
              action="#"
              className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
              aria-label="Inscription à la newsletter"
            >
              <label htmlFor="home-newsletter" className="sr-only">
                Adresse email
              </label>
              <Input
                id="home-newsletter"
                type="email"
                required
                placeholder="vous@exemple.dz"
                className="h-11 bg-cream"
              />
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-tangerine-500 px-6 font-display text-sm font-semibold text-cream transition-colors hover:bg-tangerine-600"
              >
                S&apos;abonner
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
