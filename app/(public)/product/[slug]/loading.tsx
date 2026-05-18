import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Breadcrumb */}
      <Skeleton className="h-3.5 w-72 max-w-full bg-parchment" />

      {/* Two-column: gallery + info */}
      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* Gallery — main image (1:1) + thumb strip */}
        <div className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-lg bg-parchment" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="size-20 shrink-0 rounded-md bg-parchment"
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <Skeleton className="h-3.5 w-24 bg-parchment" />
          <Skeleton className="h-9 w-5/6 bg-parchment sm:h-11" />
          <Skeleton className="h-4 w-2/3 bg-parchment" />

          {/* Price block */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-parchment" />
            <Skeleton className="h-10 w-40 bg-parchment" />
          </div>

          {/* Short description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-parchment" />
            <Skeleton className="h-4 w-5/6 bg-parchment" />
            <Skeleton className="h-4 w-3/4 bg-parchment" />
          </div>

          {/* Variant selector */}
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-20 bg-parchment" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="size-10 rounded-full bg-parchment" />
              ))}
            </div>
          </div>

          {/* Add-to-cart row */}
          <div className="flex gap-3">
            <Skeleton className="h-11 w-32 bg-parchment" />
            <Skeleton className="h-11 flex-1 bg-parchment" />
          </div>

          {/* Secondary actions */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-44 bg-parchment" />
            <Skeleton className="h-10 w-40 bg-parchment" />
          </div>

          {/* Delivery card */}
          <Skeleton className="h-24 w-full rounded-lg bg-parchment" />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 space-y-4">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-36 rounded-md bg-parchment" />
          ))}
        </div>
        <Skeleton className="h-32 w-full bg-parchment" />
      </div>

      {/* Related grid */}
      <div className="mt-16">
        <Skeleton className="h-8 w-56 bg-parchment" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-wood-600/15 bg-cream"
            >
              <Skeleton className="aspect-[5/6] w-full rounded-none bg-parchment" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-3 w-24 bg-parchment" />
                <Skeleton className="h-5 w-3/4 bg-parchment" />
                <Skeleton className="h-5 w-1/2 bg-parchment" />
                <Skeleton className="mt-3 h-9 w-full bg-parchment" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
