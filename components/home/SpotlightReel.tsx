"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Tag, Zap } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { discountPercent } from "@/lib/format";
import { useFormatDZD } from "@/lib/i18n/LanguageProvider";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";

type Slide =
  | { kind: "promo"; product: Product; image: string; focalY: string }
  | { kind: "new"; product: Product; image: string; focalY: string }
  | { kind: "category"; category: Category; image: string; focalY: string };

interface SpotlightReelProps {
  promoProducts: Product[];
  newProducts: Product[];
  highlightedCategories: Category[];
  intervalMs?: number;
}

/**
 * Compact photo-backed ad reel above the hero. Each slide is a real outdoor
 * photo with a dark scrim, a badge, a one-line title, and a single CTA.
 * Short height — keeps the page hero below as the main attention point.
 */
const PROMO_IMAGE = "/spotlight/boots-camera.jpg";
const NEW_IMAGE = "/spotlight/gear-flatlay.jpg";
const CATEGORY_IMAGE = "/spotlight/backpack-river.jpg";

export function SpotlightReel({
  promoProducts,
  newProducts,
  highlightedCategories,
  intervalMs = 5500,
}: SpotlightReelProps) {
  const slides = React.useMemo<Slide[]>(() => {
    const out: Slide[] = [];
    const maxLen = Math.max(
      promoProducts.length,
      newProducts.length,
      highlightedCategories.length
    );
    for (let i = 0; i < maxLen; i++) {
      if (promoProducts[i]) {
        out.push({
          kind: "promo",
          product: promoProducts[i]!,
          image: PROMO_IMAGE,
          focalY: "60%",
        });
      }
      if (newProducts[i]) {
        out.push({
          kind: "new",
          product: newProducts[i]!,
          image: NEW_IMAGE,
          focalY: "50%",
        });
      }
      if (highlightedCategories[i]) {
        out.push({
          kind: "category",
          category: highlightedCategories[i]!,
          image: CATEGORY_IMAGE,
          focalY: "55%",
        });
      }
    }
    return out.slice(0, 3);
  }, [promoProducts, newProducts, highlightedCategories]);

  const autoplay = React.useRef(
    Autoplay({ delay: intervalMs, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", containScroll: false },
    [autoplay.current]
  );

  const [selected, setSelected] = React.useState(0);
  React.useEffect(() => {
    if (!emblaApi) return;
    const update = () => setSelected(emblaApi.selectedScrollSnap());
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="À l'affiche"
      className="relative bg-ink"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y select-none">
          {slides.map((slide, i) => (
            <div
              key={`${slide.kind}-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} sur ${slides.length}`}
              className="relative min-w-0 flex-[0_0_100%]"
            >
              <SpotlightSlide
                slide={slide}
                priority={i === 0}
                isActive={selected === i}
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

/* ───── Slides ───── */

function SpotlightSlide({
  slide,
  priority,
  isActive,
}: {
  slide: Slide;
  priority: boolean;
  isActive: boolean;
}) {
  if (slide.kind === "promo") {
    return (
      <SlideShell
        image={slide.image}
        focalY={slide.focalY}
        priority={priority}
        isActive={isActive}
        accent="tangerine"
      >
        <PromoCopy product={slide.product} />
      </SlideShell>
    );
  }
  if (slide.kind === "new") {
    return (
      <SlideShell
        image={slide.image}
        focalY={slide.focalY}
        priority={priority}
        isActive={isActive}
        accent="tangerine"
      >
        <NewCopy product={slide.product} />
      </SlideShell>
    );
  }
  return (
    <SlideShell
      image={slide.image}
      focalY={slide.focalY}
      priority={priority}
      isActive={isActive}
      accent="forest"
    >
      <CategoryCopy category={slide.category} />
    </SlideShell>
  );
}

function SlideShell({
  image,
  focalY,
  priority,
  isActive,
  accent,
  children,
}: {
  image: string;
  focalY: string;
  priority: boolean;
  isActive: boolean;
  accent: "tangerine" | "forest";
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-[80px] w-full overflow-hidden bg-ink text-cream sm:h-[100px] md:h-[120px]">
      <Image
        src={image}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: `center ${focalY}` }}
      />
      {/* Filters: bottom-to-top forest scrim + side-to-side gradient + slight saturation */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/15"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent"
      />
      {accent === "tangerine" ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,rgba(234,108,29,0.18),transparent_55%)]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(34,71,42,0.22),transparent_55%)]"
        />
      )}

      <div
        className={cn(
          "relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-10",
          isActive && "animate-in fade-in slide-in-from-bottom-1 duration-700"
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ───── Per-kind copy blocks ───── */

function PromoCopy({ product }: { product: Product }) {
  const formatPrice = useFormatDZD();
  const pct = discountPercent(product.price, product.oldPrice) ?? 0;
  return (
    <div className="flex w-full items-center justify-between gap-3 sm:gap-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="ink">
            <Sparkles className="size-2.5" />
            Promo
          </Badge>
          {pct > 0 ? (
            <span className="rounded-full bg-tangerine-500 px-1.5 py-0.5 font-mono text-[9px] font-bold tabular-nums text-cream">
              -{pct}%
            </span>
          ) : null}
        </div>
        <h3 className="mt-0.5 line-clamp-1 font-display text-xs font-semibold leading-tight tracking-[-0.01em] sm:text-sm md:text-base">
          {product.name}
        </h3>
        <p className="mt-0.5 flex items-baseline gap-1.5">
          <span className="font-display text-[11px] font-semibold tabular-nums sm:text-xs">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice ? (
            <span className="font-mono text-[9px] text-cream/70 line-through tabular-nums">
              {formatPrice(product.oldPrice)}
            </span>
          ) : null}
        </p>
      </div>
      <CtaLink href={routes.product(product.slug)} tone="tangerine">
        En profiter
      </CtaLink>
    </div>
  );
}

function NewCopy({ product }: { product: Product }) {
  return (
    <div className="flex w-full items-center justify-between gap-3 sm:gap-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="tangerine">
            <Zap className="size-2.5" fill="currentColor" />
            Nouveau
          </Badge>
          <Badge tone="outline">{product.brand.name}</Badge>
        </div>
        <h3 className="mt-0.5 line-clamp-1 font-display text-xs font-semibold leading-tight tracking-[-0.01em] sm:text-sm md:text-base">
          {product.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 max-w-sm text-[10px] text-cream/80 sm:text-[11px]">
          {product.descriptionShort}
        </p>
      </div>
      <CtaLink href={routes.product(product.slug)} tone="tangerine">
        Découvrir
      </CtaLink>
    </div>
  );
}

function CategoryCopy({ category }: { category: Category }) {
  return (
    <div className="flex w-full items-center justify-between gap-3 sm:gap-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="glass">
            <Tag className="size-2.5" />
            Collection
          </Badge>
          <Badge tone="glass">{category.productCount}+ produits</Badge>
        </div>
        <h3 className="mt-0.5 line-clamp-1 font-display text-xs font-semibold leading-tight tracking-[-0.01em] sm:text-sm md:text-base">
          {category.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 max-w-sm text-[10px] text-cream/80 sm:text-[11px]">
          Sélection complète — testée sur le terrain.
        </p>
      </div>
      <CtaLink href={routes.category(category.slug)} tone="glass">
        Voir la collection
      </CtaLink>
    </div>
  );
}

/* ───── Bits ───── */

function Badge({
  tone,
  children,
}: {
  tone: "ink" | "tangerine" | "outline" | "glass";
  children: React.ReactNode;
}) {
  const cls =
    tone === "ink"
      ? "bg-ink/85 text-cream"
      : tone === "tangerine"
        ? "bg-tangerine-500 text-cream"
        : tone === "outline"
          ? "border border-cream/30 text-cream/85 backdrop-blur"
          : "bg-cream/15 text-cream/90 backdrop-blur";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]",
        cls
      )}
    >
      {children}
    </span>
  );
}

function CtaLink({
  href,
  tone,
  children,
}: {
  href: string;
  tone: "tangerine" | "glass";
  children: React.ReactNode;
}) {
  const cls =
    tone === "tangerine"
      ? "bg-tangerine-500 text-cream hover:bg-tangerine-600"
      : "border border-cream/40 bg-cream/10 text-cream backdrop-blur hover:bg-cream/20";
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-display text-[10px] font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:px-3 sm:py-1.5 sm:text-[11px]",
        cls
      )}
    >
      {children}
      <ArrowRight className="size-2.5 sm:size-3" />
    </Link>
  );
}
