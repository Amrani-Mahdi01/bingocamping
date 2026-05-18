import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Skeleton className="h-3.5 w-20 bg-parchment" />
          <Skeleton className="mt-3 h-8 w-44 bg-parchment" />
          <Skeleton className="mt-2 h-3.5 w-40 bg-parchment" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full bg-parchment" />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: timeline + items */}
        <div className="space-y-6">
          <div className="rounded-lg bg-parchment p-5">
            <Skeleton className="h-3.5 w-16 bg-wood-200" />
            <Skeleton className="mt-2 h-5 w-48 bg-wood-200" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="size-8 shrink-0 rounded-full bg-wood-200" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32 bg-wood-200" />
                    <Skeleton className="h-3 w-40 bg-wood-200" />
                  </div>
                  <Skeleton className="h-3 w-20 bg-wood-200" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-cream p-5 shadow-sm">
            <Skeleton className="h-3.5 w-16 bg-parchment" />
            <Skeleton className="mt-2 h-5 w-40 bg-parchment" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-wood-600/10 pb-3 last:border-0"
                >
                  <Skeleton className="size-14 shrink-0 rounded-md bg-parchment" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-3/4 bg-parchment" />
                    <Skeleton className="h-3 w-1/3 bg-parchment" />
                  </div>
                  <Skeleton className="h-4 w-16 bg-parchment" />
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-wood-600/15 pt-4">
              <Skeleton className="h-4 w-full bg-parchment" />
              <Skeleton className="h-4 w-full bg-parchment" />
              <Skeleton className="h-6 w-full bg-parchment" />
            </div>
          </div>
        </div>

        {/* Right: address + support */}
        <aside className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-parchment p-4">
              <Skeleton className="h-3.5 w-24 bg-wood-200" />
              <Skeleton className="mt-3 h-4 w-3/4 bg-wood-200" />
              <Skeleton className="mt-1.5 h-3 w-full bg-wood-200" />
              <Skeleton className="mt-1 h-3 w-5/6 bg-wood-200" />
              <Skeleton className="mt-3 h-3 w-36 bg-wood-200" />
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
