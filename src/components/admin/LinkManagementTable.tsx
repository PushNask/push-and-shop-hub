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
import { AdminPagination } from "./pagination/AdminPagination";
import type { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";

interface LinkManagementTableProps {
  linkSlots: Product[];
  onAssignProduct: (slot: number, productId: string) => Promise<void>;
  isLoading?: boolean;
  isAssigning?: boolean;
}

const ITEMS_PER_PAGE = 20;

export function LinkManagementTable({
  linkSlots,
  onAssignProduct,
  isLoading,
  isAssigning,
}: LinkManagementTableProps) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleAssignProduct = async (productId: string) => {
    if (selectedSlot !== null) {
      await onAssignProduct(selectedSlot, productId);
      setIsDialogOpen(false);
      setSelectedSlot(null);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const totalPages = Math.ceil(120 / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-12 w-12" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

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
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => {
              const slot = startIndex + index + 1;
              if (slot > 120) return null;
              
              const product = linkSlots?.find((p) => p.link_slot === slot);
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
                      disabled={isAssigning}
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

      <AdminPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ProductAssignmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAssign={handleAssignProduct}
        slot={selectedSlot}
        isAssigning={isAssigning}
      />
    </>
  );
}