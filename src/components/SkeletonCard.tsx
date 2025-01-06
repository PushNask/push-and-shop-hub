import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  viewMode?: 'grid' | 'list';
}

export function SkeletonCard({ viewMode = 'grid' }: SkeletonCardProps) {
  return (
    <div className={cn(
      "space-y-4 animate-pulse",
      viewMode === 'list' ? "flex gap-4" : "block"
    )}>
      <Skeleton 
        className={cn(
          "rounded-lg bg-muted/70",
          viewMode === 'list' ? "w-[200px] h-[200px]" : "aspect-square w-full"
        )} 
      />
      <div className={cn(
        "space-y-3",
        viewMode === 'list' ? "flex-1" : ""
      )}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
}