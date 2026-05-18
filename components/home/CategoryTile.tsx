import * as React from "react";
import Link from "next/link";
import {
  Backpack,
  ChefHat,
  Compass,
  Footprints,
  Lamp,
  Moon,
  Shirt,
  Tent,
  type LucideIcon,
} from "lucide-react";

import { Mono } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

const ICONS: Record<string, LucideIcon> = {
  Tent,
  Moon,
  ChefHat,
  Lamp,
  Backpack,
  Shirt,
  Footprints,
  Compass,
};

interface CategoryTileProps {
  slug: string;
  name: string;
  productCount: number;
  icon: string;
  className?: string;
}

export function CategoryTile({
  slug,
  name,
  productCount,
  icon,
  className,
}: CategoryTileProps) {
  const Icon = ICONS[icon] ?? Compass;
  return (
    <Link
      href={routes.category(slug)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg bg-parchment p-6 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500",
        className
      )}
    >
      {/* 2-tone illustration: forest circle + wood icon */}
      <div className="relative mb-4 h-24">
        <span
          aria-hidden="true"
          className="absolute left-2 top-2 size-16 rounded-full bg-forest-100"
        />
        <span
          aria-hidden="true"
          className="absolute left-8 top-6 size-16 rounded-full bg-wood-100"
        />
        <span className="relative ml-12 mt-3 inline-flex size-12 items-center justify-center rounded-full bg-cream text-wood-700 shadow-sm">
          <Icon className="size-6" strokeWidth={1.4} />
        </span>
      </div>

      <h3 className="font-display text-md font-semibold text-ink leading-tight">
        {name}
      </h3>
      <Mono className="mt-1 text-wood-600">{productCount} produits</Mono>

      {/* Underline reveal on hover */}
      <span className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-wood-600 transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}
