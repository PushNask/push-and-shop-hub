import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAvailableProducts } from "@/hooks/useAvailableProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

interface ProductAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (productId: string) => Promise<void>;
  slot: number | null;
  isAssigning?: boolean;
}

export function ProductAssignmentDialog({
  open,
  onOpenChange,
  onAssign,
  slot,
  isAssigning,
}: ProductAssignmentDialogProps) {
  const { data: products, isLoading, error } = useAvailableProducts();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Product to Slot P{slot}</DialogTitle>
          <DialogDescription>
            Select a product to assign to this slot. Only approved products without an assigned slot are shown.
          </DialogDescription>
        </DialogHeader>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-destructive">
              Failed to load products. Please try again.
            </div>
          ) : filteredProducts?.length === 0 ? (
            <div className="text-center text-muted-foreground">
              {searchQuery ? "No products match your search" : "No available products found"}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts?.map((product) => (
                <Button
                  key={product.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onAssign(product.id)}
                  disabled={isAssigning}
                >
                  {product.title}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}