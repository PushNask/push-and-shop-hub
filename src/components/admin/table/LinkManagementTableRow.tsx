import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";
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
  const { toast } = useToast();
  const isFeatured = slot <= 12;
  
  const handleCopyLink = () => {
    const link = `${window.location.origin}/P${slot}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "The permanent link has been copied to your clipboard.",
    });
  };

  const handleViewProduct = () => {
    if (product) {
      window.open(`/products/${product.id}`, '_blank');
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">P{slot}</TableCell>
      <TableCell>
        <Badge variant={isFeatured ? "default" : "secondary"}>
          {isFeatured ? "Featured" : "Standard"}
        </Badge>
      </TableCell>
      <TableCell>{product?.title || "Available"}</TableCell>
      <TableCell>
        {product?.status ? (
          <Badge 
            variant={product.status === "approved" ? "default" : "secondary"}
          >
            {product.status}
          </Badge>
        ) : (
          "N/A"
        )}
      </TableCell>
      <TableCell className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          disabled={!product}
        >
          Copy Link
        </Button>
        {product && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewProduct}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAssign(slot)}
          disabled={isAssigning}
        >
          {product ? "Change Product" : "Assign Product"}
        </Button>
      </TableCell>
    </TableRow>
  );
}