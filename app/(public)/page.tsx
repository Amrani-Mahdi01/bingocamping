import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Mono } from "@/components/ui/typography";
import { ProductCard } from "@/components/product/ProductCard";
import { BannerSlider } from "@/components/home/BannerSlider";
import { HeroMountains } from "@/components/home/HeroMountains";
import { TranslatedCategoryTile } from "@/components/home/TranslatedCategoryTile";
import { TranslatedSectionHeader } from "@/components/home/TranslatedSectionHeader";
import { TrustBand } from "@/components/home/TrustBand";
import { TranslatedImageDivider } from "@/components/decorative/TranslatedImageDivider";
import { ScrollReveal } from "@/components/decorative/ScrollReveal";
import { T } from "@/components/i18n/T";
import { adaptProduct } from "@/lib/api/adapters";
import { listPublicBanners } from "@/lib/api/banners.server";
import { listPublicCategories } from "@/lib/api/categories.server";
import { listPublicProducts } from "@/lib/api/products.server";
import { routes } from "@/lib/routes";

export const revalidate = 60;

export default async function HomePage() {
  const [
    banners,
    topCategories,
    featuredRes,
    newRes,
    promoRes,
    bestRes,
  ] = await Promise.all([
    listPublicBanners(),
    listPublicCategories(),
    listPublicProducts({ flag: "featured", perPage: 8 }),
    listPublicProducts({ flag: "new", sort: "new", perPage: 8 }),
    listPublicProducts({ flag: "promo", perPage: 8 }),
    listPublicProducts({ flag: "bestseller", sort: "bestseller", perPage: 8 }),
  ]);

  const topCats = topCategories.slice(0, 8);
  const featured = featuredRes.items.map(adaptProduct);
  const news = newRes.items.map(adaptProduct);
  const promos = promoRes.items.map(adaptProduct);
  const best = bestRes.items.map(adaptProduct);

  return (
    <>
      {/* 1. Hero — promo banner carousel.
          The mountain hero `<HeroMountains />` is hidden for now but
          kept in the codebase (import above, component file at
          components/home/HeroMountains.tsx) so it can be swapped
          back in by flipping the two lines below. */}
      <BannerSlider banners={banners} />
      {/* <HeroMountains /> */}

      {/* 2. Trust band */}
      <TrustBand />

      {/* 3. Categories — cream */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <TranslatedSectionHeader
            eyebrow="home.categories.eyebrow"
            title="home.categories.title"
            lead="home.categories.lead"
            ctaLabel="home.categories.cta"
            ctaHref={routes.catalog}
          />
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {topCats.map((cat, i) => (
                <TranslatedCategoryTile key={cat.id} category={cat} index={i} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. Featured */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <TranslatedSectionHeader
            eyebrow="home.featured.eyebrow"
            title="home.featured.title"
            lead="home.featured.lead"
            ctaLabel="home.featured.cta"
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


      <TranslatedImageDivider
        src="/dividers/road-mountains.jpg"
        quote="home.divider.adventure"
        attribution="home.divider.manifesto"
      />

      {/* 5. New arrivals — cream */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <TranslatedSectionHeader
            eyebrow="home.new.eyebrow"
            title="home.new.title"
            lead="home.new.lead"
            ctaLabel="home.new.cta"
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

      <TranslatedImageDivider
        src="/hero/lake-campfire.jpg"
        quote="home.divider.equipment"
        attribution="home.divider.manifesto"
      />

      {/* 6. Promotions */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <TranslatedSectionHeader
            eyebrow="home.promos.eyebrow"
            title="home.promos.title"
            lead="home.promos.lead"
            ctaLabel="home.promos.cta"
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

      <TranslatedImageDivider
        src="/dividers/camp-view.jpg"
        quote="home.divider.farFromAll"
        attribution="home.divider.manifesto"
      />

      {/* 7. Best sellers — cream */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <TranslatedSectionHeader
            eyebrow="home.best.eyebrow"
            title="home.best.title"
            ctaLabel="home.best.cta"
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
              <Mono className="text-tangerine-300">
                <T k="home.editorial.eyebrow" />
              </Mono>
              <h2 className="mt-3 font-display text-xl leading-[1.1] tracking-[-0.02em] sm:mt-4 sm:text-4xl">
                <T k="home.editorial.title" />
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-cream/80 sm:mt-5 sm:text-base">
                <T k="home.editorial.para1" />
              </p>
              <p className="mt-3 text-xs leading-relaxed text-cream/80 sm:mt-4 sm:text-base">
                <T k="home.editorial.para2" />
              </p>
              <Link
                href={routes.about}
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-cream/30 px-4 py-2 font-display text-xs font-semibold text-cream transition-colors hover:border-tangerine-400 hover:text-tangerine-300 sm:mt-8 sm:px-6 sm:py-3 sm:text-sm"
              >
                <T k="home.editorial.cta" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 9. Catalogue CTA */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <ScrollReveal>
            <Mono className="text-tangerine-600">
              <T k="home.catalogCta.eyebrow" />
            </Mono>
            <h2 className="mt-3 font-display text-2xl leading-[1.1] tracking-[-0.02em] text-ink sm:text-3xl">
              <T k="home.catalogCta.title" />
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              <T k="home.catalogCta.lead" />
            </p>
            <Link
              href={routes.catalog}
              className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-tangerine-500 px-8 font-display text-sm font-semibold text-cream transition-all hover:bg-tangerine-600 hover:scale-[1.02]"
            >
              <T k="home.catalogCta.cta" />
              <ArrowRight className="size-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
