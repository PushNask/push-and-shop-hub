import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Product } from "@/types/product";

interface ProductAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (productId: string) => Promise<void>;
  slot: number | null;
}

export function ProductAssignmentDialog({
  open,
  onOpenChange,
  onAssign,
  slot,
}: ProductAssignmentDialogProps) {
  const { data: products, isLoading } = useQuery({
    queryKey: ["available-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .is("link_slot", null)
        .eq("status", "approved");

      if (error) throw error;
      return data as Product[];
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Product to Slot P{slot}</DialogTitle>
          <DialogDescription>
            Select a product to assign to this slot. Only approved products without an assigned slot are shown.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {isLoading ? (
            <div>Loading available products...</div>
          ) : products?.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No available products found
            </div>
          ) : (
            <div className="space-y-2">
              {products?.map((product) => (
                <Button
                  key={product.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onAssign(product.id)}
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