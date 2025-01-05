import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
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
  const isFeatured = slot <= 12;

  return (
    <TableRow>
      <TableCell className="font-medium">P{slot}</TableCell>
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
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAssign(slot)}
          disabled={isAssigning}
        >
          {product ? "Replace" : "Assign"}
        </Button>
      </TableCell>
    </TableRow>
  );
}