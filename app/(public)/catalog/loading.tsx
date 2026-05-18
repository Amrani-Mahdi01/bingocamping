import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Skeleton className="h-4 w-48 bg-parchment" />
      <Skeleton className="mt-6 h-10 w-1/3 bg-parchment" />
      <Skeleton className="mt-3 h-4 w-2/3 bg-parchment" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <Skeleton className="h-[640px] w-full rounded-lg bg-parchment" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full bg-parchment" />
          ))}
        </div>
      </div>
    </div>
  );
}
