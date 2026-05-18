import { Skeleton } from "@/components/ui/skeleton";

/**
 * Fallback skeleton for any `(public)` route without its own loading.tsx.
 * Mirrors the common "parchment header band + cream content" page shape
 * used across the storefront (about, contact, faq, cart, checkout, etc.).
 */
export default function PublicLoading() {
  return (
    <>
      {/* Header band */}
      <section className="border-b border-wood-600/10 bg-parchment">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <Skeleton className="h-3.5 w-40 bg-wood-200" />
          <Skeleton className="mt-4 h-4 w-24 bg-wood-200" />
          <Skeleton className="mt-3 h-10 w-1/2 bg-wood-200 sm:h-12" />
          <Skeleton className="mt-3 h-4 w-2/3 bg-wood-200" />
          <Skeleton className="mt-1 h-4 w-1/2 bg-wood-200" />
        </div>
      </section>

      {/* Content grid */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-16 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-wood-600/15 bg-cream"
            >
              <Skeleton className="aspect-[5/6] w-full rounded-none bg-wood-200" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-3 w-24 bg-wood-200" />
                <Skeleton className="h-5 w-3/4 bg-wood-200" />
                <Skeleton className="h-5 w-1/2 bg-wood-200" />
                <Skeleton className="mt-3 h-9 w-full bg-wood-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
