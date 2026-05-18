import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Skeleton className="h-6 w-32 bg-parchment" />
      <Skeleton className="mt-3 h-10 w-3/5 bg-parchment" />
      <Skeleton className="mt-2 h-4 w-2/3 bg-parchment" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full bg-parchment" />
        ))}
      </div>
    </div>
  );
}
