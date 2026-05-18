import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
  return (
    <>
      {/* Parchment header band — breadcrumb + title + search input */}
      <section className="border-b border-wood-600/10 bg-parchment">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <Skeleton className="h-3.5 w-44 bg-wood-200" />
          <div className="mt-6 max-w-xl">
            <Skeleton className="h-3.5 w-20 bg-wood-200" />
            <Skeleton className="mt-3 h-9 w-1/2 bg-wood-200 sm:h-10" />
            <Skeleton className="mt-3 h-4 w-3/4 bg-wood-200" />
          </div>
          <Skeleton className="mt-8 h-14 max-w-3xl rounded-xl bg-wood-200" />
        </div>
      </section>

      {/* Cream main — chip row + sidebar + grid */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          {/* Active filter chips strip */}
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-7 w-24 rounded-full bg-parchment"
              />
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <div className="overflow-hidden rounded-xl border border-wood-600/15 bg-cream">
              <Skeleton className="h-12 rounded-none bg-parchment" />
              <div className="space-y-5 p-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-24 bg-parchment" />
                    <div className="space-y-2">
                      <Skeleton className="h-3.5 w-full bg-parchment" />
                      <Skeleton className="h-3.5 w-5/6 bg-parchment" />
                      <Skeleton className="h-3.5 w-3/4 bg-parchment" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="min-w-0">
              <div className="mb-5 flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-48 bg-parchment" />
                <Skeleton className="h-9 w-40 bg-parchment" />
              </div>

              <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <li
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
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
