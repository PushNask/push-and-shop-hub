import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, Eye, ExternalLink } from "lucide-react";
import { useState } from "react";
import { LinkSlotDetailsDialog } from "../LinkSlotDetailsDialog";
import type { Product } from "@/types/product";

interface LinkManagementTableRowProps {
  slot: number;
  product?: Product;
  onAssign: (slot: number) => void;
  isAssigning?: boolean;
}

export function LinkManagementTableRow({
  slot,
  product,
  onAssign,
  isAssigning,
}: LinkManagementTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isFeatured = slot <= 12;
  const permanentLink = `${window.location.origin}/P${slot}`;

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            P{slot}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                navigator.clipboard.writeText(permanentLink);
                toast.success("Link copied to clipboard");
              }}
              title="Copy permanent link"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant={isFeatured ? "default" : "secondary"}>
            {isFeatured ? "Featured" : "Standard"}
          </Badge>
        </TableCell>
        <TableCell>
          {product ? (
            <span className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              {product.title}
            </span>
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
        <TableCell className="space-x-2">
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
        </TableCell>
      </TableRow>

      <LinkSlotDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        slot={slot}
        product={product}
        onAssign={onAssign}
      />
    </>
  );
}