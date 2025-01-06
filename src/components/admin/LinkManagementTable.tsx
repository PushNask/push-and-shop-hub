import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import { ProductAssignmentDialog } from "./ProductAssignmentDialog";
import { AdminPagination } from "./pagination/AdminPagination";
import { LinkManagementTableHeader } from "./table/LinkManagementTableHeader";
import { LinkManagementTableRow } from "./table/LinkManagementTableRow";
import { LinkManagementTableSkeleton } from "./table/LinkManagementTableSkeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Product } from "@/types/product";

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
  const [searchQuery, setSearchQuery] = useState("");

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
    return <LinkManagementTableSkeleton />;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products in link slots..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <LinkManagementTableHeader />
            <TableBody>
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => {
                const slot = startIndex + index + 1;
                if (slot > 120) return null;
                
                const product = linkSlots?.find((p) => p.link_slot === slot);
                
                // Filter based on search query
                if (
                  searchQuery &&
                  product?.title.toLowerCase().includes(searchQuery.toLowerCase()) === false
                ) {
                  return null;
                }

                return (
                  <LinkManagementTableRow
                    key={slot}
                    slot={slot}
                    product={product}
                    onAssign={(slot) => {
                      setSelectedSlot(slot);
                      setIsDialogOpen(true);
                    }}
                    isAssigning={isAssigning}
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
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