import { useState } from "react";
import { PendingProductCard } from "@/components/admin/PendingProductCard";
import { ProductReviewDialog } from "@/components/admin/ProductReviewDialog";
import { useProductApprovals } from "@/hooks/useProductApprovals";
import { useProductList } from "@/hooks/useProductList";
import { Loader2 } from "lucide-react";
import { Product } from "@/types/product";
import { useAdminAudit } from "@/hooks/useAdminAudit";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ProductApprovals = () => {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading, error, refetch } = useProductList();
  const { logAdminAction } = useAdminAudit();
  const [isOptimisticUpdate, setIsOptimisticUpdate] = useState(false);
  
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
    if (!selectedProduct) return;

    // Optimistic update
    setIsOptimisticUpdate(true);
    const previousProducts = queryClient.getQueryData(["pending-products"]) as Product[];
    queryClient.setQueryData(
      ["pending-products"],
      (old: Product[] = []) => old.filter(p => p.id !== selectedProduct.id)
    );

    try {
      await handleAction(action);
      await logAdminAction(`product_${action}`, {
        product_id: selectedProduct.id,
        feedback: feedback
      });
      
      toast.success(
        `Product ${action === "approve" ? "approved" : "rejected"} successfully`,
        {
          description: action === "approve" 
            ? "The product is now live on the platform"
            : "The seller will be notified with your feedback"
        }
      );
    } catch (error) {
      // Revert optimistic update on error
      queryClient.setQueryData(["pending-products"], previousProducts);
      console.error(`Error ${action}ing product:`, error);
      toast.error(
        `Failed to ${action} product`,
        {
          description: "Please try again. If the problem persists, contact support.",
          action: {
            label: "Retry",
            onClick: () => onReviewComplete(action)
          }
        }
      );
    } finally {
      setIsOptimisticUpdate(false);
      setIsDialogOpen(false);
      setFeedback("");
      await refetch();
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <p className="text-red-500 mb-2">Failed to load pending products</p>
        <p className="text-sm text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "Please try again later"}
        </p>
        <button 
          onClick={() => refetch()}
          className="text-sm text-blue-500 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Pending Approvals</h2>
        <p className="text-sm text-muted-foreground">
          {products.length || 0} products awaiting review
        </p>
      </div>

      {isLoading || isOptimisticUpdate ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[400px] animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <p className="text-lg font-semibold mb-2">No pending approvals</p>
          <p className="text-sm text-muted-foreground">
            All product submissions have been reviewed
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
          {products.map((product: Product) => (
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