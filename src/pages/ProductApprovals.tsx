import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PendingProductCard } from "@/components/admin/PendingProductCard";
import { ProductReviewDialog } from "@/components/admin/ProductReviewDialog";
import { useProductApprovals } from "@/hooks/useProductApprovals";

// Mock data - replace with actual data fetching
const MOCK_PENDING_PRODUCTS = [
  {
    id: "p1",
    title: "iPhone 13 Pro",
    description: "Latest model with advanced features",
    price: 750000,
    images: ["/placeholder.svg"],
    category: "Electronics",
    listingType: "featured" as const,
    seller: {
      id: "s1",
      name: "Tech Store",
      rating: 4.5,
      location: "Douala, Cameroon",
      joinedDate: "2023-12-01"
    },
    submittedAt: "2024-02-20T10:00:00Z"
  },
  {
    id: "p2",
    title: "Samsung TV",
    description: "50-inch Smart TV",
    price: 450000,
    images: ["/placeholder.svg"],
    category: "Electronics",
    listingType: "standard" as const,
    seller: {
      id: "s2",
      name: "Electronics Hub",
      rating: 4.2,
      location: "Yaoundé, Cameroon",
      joinedDate: "2023-11-15"
    },
    submittedAt: "2024-02-19T15:30:00Z"
  }
];

const ProductApprovals = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    feedback,
    setFeedback,
    isDialogOpen,
    setIsDialogOpen,
    handleAction
  } = useProductApprovals();

  return (
    <DashboardLayout title="Product Approvals">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
        {MOCK_PENDING_PRODUCTS.map((product) => (
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