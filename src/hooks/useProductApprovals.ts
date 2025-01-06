import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const useProductApprovals = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAction = async (action: "approve" | "reject") => {
    if (!selectedProduct?.id) {
      toast.error("No product selected");
      return;
    }

    if (action === "reject" && !feedback.trim()) {
      toast.error("Feedback is required when rejecting a product");
      return;
    }

    try {
      // First, get the product details to check the listing type
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("listingType")
        .eq("id", selectedProduct.id)
        .single();

      if (productError) throw productError;

      // Get the next available slot based on listing type
      const { data: slots, error: slotsError } = await supabase
        .from("products")
        .select("link_slot")
        .eq("status", "approved")
        .order("link_slot", { ascending: true });

      if (slotsError) throw slotsError;

      let nextSlot = 1;
      if (product.listingType === "featured") {
        // Find next available featured slot (1-12)
        const usedSlots = slots
          .map(s => s.link_slot)
          .filter(slot => slot && slot <= 12)
          .sort((a, b) => a - b);
        
        for (let i = 1; i <= 12; i++) {
          if (!usedSlots.includes(i)) {
            nextSlot = i;
            break;
          }
        }
        if (nextSlot > 12) {
          throw new Error("No featured slots available");
        }
      } else {
        // Find next available standard slot (13-120)
        const usedSlots = slots
          .map(s => s.link_slot)
          .filter(slot => slot && slot > 12)
          .sort((a, b) => a - b);
        
        for (let i = 13; i <= 120; i++) {
          if (!usedSlots.includes(i)) {
            nextSlot = i;
            break;
          }
        }
        if (nextSlot > 120) {
          throw new Error("No standard slots available");
        }
      }

      // Update the product status and assign the slot
      const { error: updateError } = await supabase
        .from("products")
        .update({ 
          status: action === "approve" ? "approved" : "rejected",
          link_slot: action === "approve" ? nextSlot : null
        })
        .eq("id", selectedProduct.id);

      if (updateError) throw updateError;

      // Send notification via edge function
      const { error: notificationError } = await supabase.functions.invoke(
        "product-status-notification",
        {
          body: { 
            productId: selectedProduct.id, 
            status: action, 
            feedback,
            slot: action === "approve" ? nextSlot : null
          },
        }
      );

      if (notificationError) {
        console.error("Failed to send notification:", notificationError);
        // Don't throw here as the main action succeeded
        toast.error("Product updated but notification failed to send");
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error updating product status:", error);
      throw new Error(error.message || "Failed to update product status");
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