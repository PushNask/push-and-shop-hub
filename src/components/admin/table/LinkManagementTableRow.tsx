import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, Eye, Copy } from "lucide-react";
import { useState } from "react";
import { LinkSlotDetailsDialog } from "../LinkSlotDetailsDialog";
import { toast } from "sonner";
import type { Product } from "@/types/product";

interface LinkManagementTableRowProps {
  slot: number;
  product?: Product;
  slotUrl: string;
  onAssign: (slot: number) => void;
  isAssigning?: boolean;
}

export function LinkManagementTableRow({
  slot,
  product,
  slotUrl,
  onAssign,
  isAssigning,
}: LinkManagementTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isFeatured = slot <= 12;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(slotUrl);
      toast.success("URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">P{slot}</TableCell>
        <TableCell>
          <Badge variant={isFeatured ? "default" : "secondary"}>
            {isFeatured ? "Featured" : "Standard"}
          </Badge>
        </TableCell>
        <TableCell>
          {product ? (
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span>{product.title}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Available</span>
          )}
        </TableCell>
        <TableCell>
          {product ? (
            <Badge variant={product.status === "approved" ? "default" : "secondary"}>
              {product.status}
            </Badge>
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssign(slot)}
              disabled={isAssigning}
            >
              {product ? "Replace" : "Assign"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDetailsOpen(true)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View details</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyUrl}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy URL</span>
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <LinkSlotDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        slot={slot}
        product={product}
        slotUrl={slotUrl}
        onAssign={onAssign}
      />
    </>
  );
}