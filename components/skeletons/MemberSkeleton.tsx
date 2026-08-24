import { Skeleton } from "../ui/skeleton";

function MembersSkeleton() {
  return (
    <div className="rounded-md border p-2 space-y-2">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex items-center justify-between rounded-md p-2"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />

            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      ))}
    </div>
  );
}
export default MembersSkeleton;
