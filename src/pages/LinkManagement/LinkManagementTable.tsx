import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { useState } from "react";
import { ProductAssignmentDialog } from "./ProductAssignmentDialog";
import type { Product } from "@/types/product";

interface LinkManagementTableProps {
  linkSlots: Product[];
  onAssignProduct: (slot: number, productId: string) => Promise<void>;
  isLoading?: boolean;
}

export function LinkManagementTable({
  linkSlots,
  onAssignProduct,
  isLoading,
}: LinkManagementTableProps) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAssignProduct = async (productId: string) => {
    if (selectedSlot !== null) {
      await onAssignProduct(selectedSlot, productId);
      setIsDialogOpen(false);
      setSelectedSlot(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slot</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Current Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 120 }).map((_, index) => {
              const slot = index + 1;
              const product = linkSlots.find((p) => p.link_slot === slot);
              const isFeatured = slot <= 12;

              return (
                <TableRow key={slot}>
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
                      onClick={() => {
                        setSelectedSlot(slot);
                        setIsDialogOpen(true);
                      }}
                      disabled={isLoading}
                    >
                      {product ? "Replace" : "Assign"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ProductAssignmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAssign={handleAssignProduct}
        slot={selectedSlot}
      />
    </>
  );
}