import { ProductCard } from "@/components/ProductCard";
import { AddProductFormValues } from "@/types/product";
import { useSession } from "@supabase/auth-helpers-react";

interface ProductPreviewProps {
  formData: Partial<AddProductFormValues>;
  imageUrls: string[];
}

export function ProductPreview({ formData, imageUrls }: ProductPreviewProps) {
  const session = useSession();

  if (!formData.title) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Preview</h3>
      <div className="max-w-sm">
        <ProductCard
          id="preview"
          title={formData.title || "Product Title"}
          price={formData.price || 0}
          images={imageUrls}
          seller={{
            email: session?.user?.email,
            country: "Cameroon",
          }}
          status="pending"
          deliveryOptions={{
            pickup: formData.pickup || false,
            shipping: formData.shipping || false,
            both: formData.both || false,
          }}
          category={formData.category}
          description={formData.description}
        />
      </div>
    </div>
  );
}