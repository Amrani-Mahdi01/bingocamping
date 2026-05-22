"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { useFavorites } from "@/lib/stores/favorites";
import { useT } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Small icon button rendered next to the product title. The previous
 * AddToCartPanel exposed favourites via a bigger toggle button; with
 * that panel gone, this is the compact replacement so customers can
 * still bookmark a product without the full purchase widget present.
 */
export function ProductFavoriteButton({
  productId,
  productName,
  className,
  iconClassName,
}: {
  productId: string;
  productName: string;
  /** Override the default container size/styling (e.g. when embedding in a slim header). */
  className?: string;
  iconClassName?: string;
}) {
  const t = useT();
  const toggleFavorite = useFavorites((s) => s.toggle);
  const isFavoriteRaw = useFavorites((s) => s.isFavorite(productId));

  // Hydration guard — the favorites store reads from localStorage on
  // mount, so the SSR-rendered "off" state would mismatch the client's
  // "on" state for items already favourited. Pretend "off" until
  // hydration completes, then sync.
  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);
  const isFavorite = hydrated && isFavoriteRaw;

  return (
    <button
      type="button"
      onClick={() => {
        toggleFavorite(productId);
        toast.success(
          isFavorite ? t("atc.favRemovedToast") : t("atc.favAddedToast"),
          { description: productName }
        );
      }}
      aria-label={isFavorite ? t("atc.favOn") : t("atc.favOff")}
      title={isFavorite ? t("atc.favOn") : t("atc.favOff")}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-wood-600/30 text-wood-700 transition-colors",
        "hover:border-ember/60 hover:text-ember",
        isFavorite && "border-ember/60 bg-ember/5 text-ember",
        className
      )}
    >
      <Heart
        className={cn("size-4", iconClassName)}
        fill={isFavorite ? "currentColor" : "none"}
      />
    </button>
  );
}
