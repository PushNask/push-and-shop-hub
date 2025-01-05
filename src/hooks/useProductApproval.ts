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
      // First update the product status
      const { error: updateError } = await supabase
        .from("products")
        .update({ 
          status: action === "approve" ? "approved" : "rejected"
        })
        .eq("id", productId);

      if (updateError) throw updateError;

      // Send notification via edge function
      const { error: notificationError } = await supabase.functions.invoke(
        "product-status-notification",
        {
          body: { productId, status: action, feedback },
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
      toast.error("Failed to update product status");
    },
  });
};