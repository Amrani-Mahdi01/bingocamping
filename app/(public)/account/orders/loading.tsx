import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <section>
      <Skeleton className="h-3.5 w-20 bg-parchment" />
      <Skeleton className="mt-3 h-8 w-56 bg-parchment sm:h-9" />
      <Skeleton className="mt-2 h-4 w-72 bg-parchment" />

      {/* Filter row — status pills + search */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-8 w-24 rounded-full bg-parchment"
            />
          ))}
        </div>
        <Skeleton className="ml-auto h-9 w-full bg-parchment sm:w-64" />
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-lg border border-wood-600/15 bg-cream">
        <Skeleton className="h-11 rounded-none bg-parchment" />
        <div className="divide-y divide-wood-600/10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5">
              <Skeleton className="h-4 w-28 bg-parchment" />
              <Skeleton className="h-4 w-20 bg-parchment" />
              <div className="flex flex-1 items-center gap-2">
                <Skeleton className="size-8 rounded-full bg-parchment" />
                <Skeleton className="h-3.5 w-16 bg-parchment" />
              </div>
              <Skeleton className="h-4 w-20 bg-parchment" />
              <Skeleton className="h-6 w-20 rounded-full bg-parchment" />
              <Skeleton className="size-8 rounded-md bg-parchment" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
