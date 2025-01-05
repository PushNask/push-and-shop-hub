import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PendingProductCard } from "@/components/admin/PendingProductCard";
import { ProductReviewDialog } from "@/components/admin/ProductReviewDialog";
import { useProductApproval } from "@/hooks/useProductApproval";
import { useProductList } from "@/hooks/useProductList";
import { adminNavItems } from "@/components/admin/navigation/AdminNav";
import { Loader2 } from "lucide-react";
import type { Product } from "@/types/product";

const ProductApprovals = () => {
  const { data: products, isLoading, error } = useProductList();
  const { mutate: handleApproval } = useProductApproval();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAction = (action: "approve" | "reject") => {
    if (!selectedProduct?.id) return;

    handleApproval({
      productId: selectedProduct.id,
      action,
      feedback: feedback.trim() || undefined,
    });
    
    setIsDialogOpen(false);
    setFeedback("");
    setSelectedProduct(null);
  };

  if (error) {
    return (
      <DashboardLayout title="Product Approvals" navItems={adminNavItems}>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <p className="text-red-500 mb-2">Failed to load pending products</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Product Approvals" navItems={adminNavItems}>
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
          {products?.map((product) => (
            <PendingProductCard
              key={product.id}
              product={product}
              onReview={(product) => {
                setSelectedProduct(product);
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
    </DashboardLayout>
  );
};

export default ProductApprovals;