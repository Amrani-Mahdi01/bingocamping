import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <>
      <Skeleton className="h-8 w-48 bg-parchment" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full bg-parchment" />
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-80 w-full bg-parchment" />
          <Skeleton className="h-80 w-full bg-parchment" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full bg-parchment" />
          <Skeleton className="h-48 w-full bg-parchment" />
        </div>
      </div>
    </>
  );
}
