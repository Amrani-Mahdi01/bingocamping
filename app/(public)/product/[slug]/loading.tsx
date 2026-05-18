import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Skeleton className="h-4 w-64 bg-parchment" />
      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-12">
        <Skeleton className="aspect-square w-full rounded-lg bg-parchment" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24 bg-parchment" />
          <Skeleton className="h-9 w-3/4 bg-parchment" />
          <Skeleton className="h-4 w-1/3 bg-parchment" />
          <Skeleton className="h-10 w-40 bg-parchment" />
          <Skeleton className="h-20 w-full bg-parchment" />
          <Skeleton className="h-12 w-full bg-parchment" />
        </div>
      </div>
    </div>
  );
}
