import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  listingType: "featured" | "standard";
  seller: {
    name: string;
    location: string;
    rating: number;
    joinedDate: string;
  };
  submittedAt: string;
}

export const useProductApprovals = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAction = async (action: "approve" | "reject") => {
    if (!selectedProduct?.id) {
      toast.error("No product selected");
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .update({ status: action === "approve" ? "approved" : "rejected" })
        .eq("id", selectedProduct.id);

      if (error) throw error;

      toast.success(`Product ${action === "approve" ? "approved" : "rejected"} successfully`);
      setIsDialogOpen(false);
      setFeedback("");
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status");
    }
  };

  return {
    selectedProduct,
    setSelectedProduct,
    feedback,
    setFeedback,
    isDialogOpen,
    setIsDialogOpen,
    handleAction,
  };
};