import Image from "next/image";
import Link from "next/link";

import { Body, H2, Lead, Mono } from "@/components/ui/typography";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PineDivider } from "@/components/decorative/PineDivider";
import { WoodGrainPattern } from "@/components/decorative/WoodGrainPattern";
import { ProductCard } from "@/components/product/ProductCard";
import { BannerSlider } from "@/components/home/BannerSlider";
import { CategoryTile } from "@/components/home/CategoryTile";
import { TrustBand } from "@/components/home/TrustBand";
import { api } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  // Single batch — every section pulls through the api client.
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
      {/* 1. Banner slider */}
      <BannerSlider banners={banners} />

      {/* 2. Trust band */}
      <TrustBand />

      {/* 3. Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <Mono className="text-wood-600">Explorez</Mono>
          <H2 className="mt-2">Explorer par catégorie</H2>
          <PineDivider className="mx-auto mt-6 max-w-md" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {topCats.map((cat) => (
            <CategoryTile
              key={cat.id}
              slug={cat.slug}
              name={cat.name}
              productCount={cat.productCount}
              icon={cat.icon}
            />
          ))}
        </div>
      </section>

      {/* 4. Featured */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <Mono className="text-wood-600">Sélection</Mono>
              <H2 className="mt-2">Produits vedettes</H2>
            </div>
            <Link
              href={routes.catalog}
              className="hidden text-sm font-medium text-wood-700 hover:text-forest-700 sm:inline-flex"
            >
              Tout voir →
            </Link>
          </div>
          {/* Mobile: horizontal scroll. Desktop: 6-up grid */}
          <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6">
            {featured.slice(0, 6).map((p) => (
              <li
                key={p.id}
                className="w-[70vw] shrink-0 snap-start sm:w-auto sm:shrink"
              >
                <ProductCard product={p} variant="compact" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. New arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <Mono className="text-wood-600">Récemment ajoutés</Mono>
            <H2 className="mt-2">Nouveautés</H2>
          </div>
          <Link
            href={`${routes.catalog}?sort=new`}
            className="hidden text-sm font-medium text-wood-700 hover:text-forest-700 sm:inline-flex"
          >
            Tout voir →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {news.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 6. Promotions strip — wood-100 + grain */}
      <section className="wood-grain relative overflow-hidden bg-wood-100">
        <WoodGrainPattern opacity={0.1} seed="promos" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <Mono className="text-forest-700">Profitez-en</Mono>
              <H2 className="mt-2 text-forest-700">Promotions en cours</H2>
            </div>
            <Link
              href={`${routes.catalog}?promoOnly=true`}
              className={cn(
                buttonVariants({ variant: "primary", size: "sm" }),
                "hidden sm:inline-flex"
              )}
            >
              Toutes les promos
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {promos.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Best sellers */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <Mono className="text-wood-600">Plébiscités</Mono>
            <H2 className="mt-2">Meilleures ventes</H2>
          </div>
          <Link
            href={`${routes.catalog}?sort=popular`}
            className="hidden text-sm font-medium text-wood-700 hover:text-forest-700 sm:inline-flex"
          >
            Tout voir →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {best.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 8. Editorial */}
      <section className="bg-parchment">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/api/placeholder/900/700/Curation-outdoor"
              alt="Notre approche de la curation outdoor"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <Mono className="text-wood-600">Notre approche</Mono>
            <h2 className="mt-2 font-display text-2xl leading-tight text-ink sm:text-3xl">
              L&apos;équipement, sans bruit.
            </h2>
            <Body className="mt-4 max-w-prose text-muted-foreground">
              Chaque produit est testé sur le terrain — Djurdjura, Hoggar,
              Aurès. Nous travaillons avec un petit nombre de marques choisies
              pour leur durabilité, leur honnêteté technique et leur SAV.
              Pas de gadgets, pas de marketing creux. Juste ce qui marche.
            </Body>
            <Link
              href={routes.about}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-6"
              )}
            >
              Notre histoire
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Newsletter */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <PineDivider className="mx-auto mb-6 max-w-xs" />
          <Mono className="text-wood-600">Restez informé</Mono>
          <H2 className="mt-2">Recevez nos nouveautés</H2>
          <Lead className="mx-auto mt-3 max-w-md">
            Une lettre par mois — nouveautés, conseils techniques et offres
            exclusives. Pas de spam.
          </Lead>
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
              className="bg-cream"
            />
            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: "primary", size: "default" }),
                "shrink-0"
              )}
            >
              S&apos;abonner
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
