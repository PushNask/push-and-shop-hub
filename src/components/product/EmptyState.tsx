import { SearchX } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-8 space-y-4">
      <SearchX className="h-12 w-12 mx-auto text-muted-foreground" />
      <p className="text-muted-foreground">No products found matching your criteria</p>
    </div>
  );
}