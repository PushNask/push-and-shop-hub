import { useState } from "react";
import { PendingProductCard } from "@/components/admin/PendingProductCard";
import { ProductReviewDialog } from "@/components/admin/ProductReviewDialog";
import { useProductApprovals } from "@/hooks/useProductApprovals";
import { useProductList } from "@/hooks/useProductList";
import { Loader2 } from "lucide-react";
import { Product } from "@/types/product";

const ProductApprovals = () => {
  const { data: products, isLoading, error } = useProductList();
  const {
    selectedProduct,
    setSelectedProduct,
    feedback,
    setFeedback,
    isDialogOpen,
    setIsDialogOpen,
    handleAction,
  } = useProductApprovals();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <p className="text-red-500 mb-2">Failed to load pending products</p>
        <p className="text-sm text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : products?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <p className="text-lg font-semibold mb-2">No pending approvals</p>
          <p className="text-sm text-muted-foreground">
            All product submissions have been reviewed
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
          {products?.map((product: Product) => (
            <PendingProductCard
              key={product.id}
              product={product}
              onReview={(p: Product) => {
                setSelectedProduct(p);
                setIsDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <ProductReviewDialog
        product={selectedProduct}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        feedback={feedback}
        onFeedbackChange={setFeedback}
        onAction={handleAction}
      />
    </div>
  );
};

export default ProductApprovals;