import type { Banner } from "@/lib/types";

export const banners: Banner[] = [
  {
    id: "banner-1",
    image: "/api/placeholder/1600/640/Printemps-en-montagne",
    title: "Le printemps en montagne",
    subtitle:
      "Découvrez la nouvelle sélection randonnée — tentes, sacs et chaussures testés dans le Djurdjura.",
    ctaLabel: "Voir la sélection",
    link: "/catalog?sort=new",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "banner-2",
    image: "/api/placeholder/1600/640/Soldes-de-saison",
    title: "Soldes de saison — jusqu'à -40 %",
    subtitle:
      "Promotions sur plus de 30 références, livraison ZR Express dans toute l'Algérie.",
    ctaLabel: "Profiter des promotions",
    link: "/catalog?promoOnly=true",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "banner-3",
    image: "/api/placeholder/1600/640/Bivouac-dans-le-Hoggar",
    title: "Cap sur le Sud — équipement bivouac",
    subtitle:
      "Sacs de couchage grand froid, réchauds multi-combustible et lampes haute autonomie pour les nuits du désert.",
    ctaLabel: "Explorer l'équipement Sud",
    link: "/catalog/sacs-de-couchage",
    displayOrder: 3,
    isActive: true,
  },
];
