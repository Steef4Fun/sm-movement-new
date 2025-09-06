import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ListingCardSkeleton = () => {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-0">
        <Skeleton className="aspect-video w-full" />
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="p-6 bg-secondary/30 flex justify-between items-center">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-10 w-20" />
      </CardFooter>
    </Card>
  );
};