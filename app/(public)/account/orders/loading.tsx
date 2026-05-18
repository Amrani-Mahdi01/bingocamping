import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <section>
      <Skeleton className="h-9 w-1/3 bg-parchment" />
      <Skeleton className="mt-2 h-4 w-2/3 bg-parchment" />
      <div className="mt-6 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full bg-parchment" />
        ))}
      </div>
    </section>
  );
}
