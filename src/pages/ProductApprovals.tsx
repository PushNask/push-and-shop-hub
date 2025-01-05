import { useState } from "react";
import { PendingProductCard } from "@/components/admin/PendingProductCard";
import { ProductReviewDialog } from "@/components/admin/ProductReviewDialog";
import { useProductApprovals } from "@/hooks/useProductApprovals";
import { useProductList } from "@/hooks/useProductList";
import { Loader2 } from "lucide-react";
import { Product } from "@/types/product";
import { useAdminAudit } from "@/hooks/useAdminAudit";

const ProductApprovals = () => {
  const { data: products, isLoading, error, refetch } = useProductList();
  const { logAdminAction } = useAdminAudit();
  const {
    selectedProduct,
    setSelectedProduct,
    feedback,
    setFeedback,
    isDialogOpen,
    setIsDialogOpen,
    handleAction,
  } = useProductApprovals();

  const onReviewComplete = async (action: "approve" | "reject") => {
    try {
      await handleAction(action);
      await logAdminAction(`product_${action}`, {
        product_id: selectedProduct?.id,
        feedback: feedback
      });
      await refetch();
    } catch (error) {
      console.error(`Error ${action}ing product:`, error);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <p className="text-red-500 mb-2">Failed to load pending products</p>
        <p className="text-sm text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Pending Approvals</h2>
        <p className="text-sm text-muted-foreground">
          {products?.length || 0} products awaiting review
        </p>
      </div>

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
        onAction={onReviewComplete}
      />
    </div>
  );
};

export default ProductApprovals;