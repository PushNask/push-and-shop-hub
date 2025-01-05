import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ApprovalAction {
  productId: string;
  action: "approve" | "reject";
  feedback?: string;
}

export const useProductApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, action, feedback }: ApprovalAction) => {
      // First, get the product details to check the listing type
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("listingType")
        .eq("id", productId)
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
        // Find the next available featured slot (1-12)
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
        // Find the next available standard slot (13-120)
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
        .eq("id", productId);

      if (updateError) throw updateError;

      // Send notification via edge function
      const { error: notificationError } = await supabase.functions.invoke(
        "product-status-notification",
        {
          body: { 
            productId, 
            status: action, 
            feedback,
            slot: action === "approve" ? nextSlot : null
          },
        }
      );

      if (notificationError) {
        console.error("Failed to send notification:", notificationError);
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-products"] });
      toast.success("Product status updated successfully");
    },
    onError: (error) => {
      console.error("Error updating product status:", error);
      toast.error(error.message || "Failed to update product status");
    },
  });
};