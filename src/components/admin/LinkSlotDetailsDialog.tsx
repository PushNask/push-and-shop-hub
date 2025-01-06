import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Link, ExternalLink, Copy } from "lucide-react";
import type { Product } from "@/types/product";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const isFeatured = slot <= 12;

  const handleCopyLink = () => {
    const link = `${window.location.origin}/P${slot}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "The permanent link has been copied to your clipboard",
    });
  };

  const handleVisitLink = () => {
    window.open(`/P${slot}`, '_blank');
  };

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
                  <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Price</p>
                    <p className="text-sm text-muted-foreground">
                      {product.price} {product.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(product.created_at || new Date()), "PPP")}
                    </p>
                  </div>
                  {product.expiry && (
                    <div>
                      <p className="text-sm font-medium">Expires</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(product.expiry), "PPP")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCopyLink}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleVisitLink}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Link
                  </Button>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      onAssign(slot);
                      onOpenChange(false);
                    }}
                  >
                    Replace Product
                  </Button>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Product Assigned</h3>
                <p className="text-sm text-muted-foreground">
                  This link slot is available for assignment
                </p>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  onAssign(slot);
                  onOpenChange(false);
                }}
              >
                Assign Product
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}