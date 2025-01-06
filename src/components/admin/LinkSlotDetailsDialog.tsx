import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductDetails } from "./link-slot/ProductDetails";
import { ProductImage } from "./link-slot/ProductImage";
import { LinkActions } from "./link-slot/LinkActions";
import { EmptySlot } from "./link-slot/EmptySlot";

interface LinkSlotDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: number;
  product?: Product;
  onAssign: (slot: number) => void;
}

export function LinkSlotDetailsDialog({
  open,
  onOpenChange,
  slot,
  product,
  onAssign,
}: LinkSlotDetailsDialogProps) {
  const isFeatured = slot <= 12;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Link Slot P{slot}
          </DialogTitle>
          <DialogDescription>
            {isFeatured ? "Featured slot with premium visibility" : "Standard link slot"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={isFeatured ? "default" : "secondary"}>
              {isFeatured ? "Featured" : "Standard"}
            </Badge>
            {product?.status && (
              <Badge 
                variant={product.status === "approved" ? "default" : "secondary"}
              >
                {product.status}
              </Badge>
            )}
          </div>

          {product ? (
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {product.images && product.images.length > 0 && (
                  <ProductImage 
                    src={product.images[0]} 
                    alt={product.title} 
                  />
                )}

                <ProductDetails product={product} />

                <LinkActions
                  slot={slot}
                  onAssign={() => onAssign(slot)}
                  onOpenChange={onOpenChange}
                />
              </div>
            </ScrollArea>
          ) : (
            <EmptySlot
              onAssign={() => onAssign(slot)}
              onOpenChange={onOpenChange}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}