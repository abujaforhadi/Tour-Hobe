import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const TravelCardSkeleton = () => {
  return (
    <Card className="h-full overflow-hidden border-none shadow-md rounded-[2.5rem] bg-white">
      <Skeleton className="aspect-[4/3] w-full" />
      <CardHeader className="p-6 space-y-3">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-12 w-28 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
};

export const TravelCardGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <TravelCardSkeleton key={i} />
      ))}
    </div>
  );
};