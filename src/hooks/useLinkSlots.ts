import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Product } from "@/types/product";

export const useLinkSlots = () => {
  const queryClient = useQueryClient();

  const { data: linkSlots, isLoading, error } = useQuery({
    queryKey: ["link-slots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          title,
          description,
          price,
          currency,
          category,
          images,
          status,
          expiry,
          link_slot,
          created_at,
          seller_id
        `)
        .not("link_slot", "is", null)
        .order("link_slot", { ascending: true });

      if (error) throw error;
      return data as Product[];
    },
  });

  const assignProductMutation = useMutation({
    mutationFn: async ({ slot, productId }: { slot: number; productId: string }) => {
      // First, clear the slot if it's currently occupied
      const { error: clearError } = await supabase
        .from("products")
        .update({ link_slot: null })
        .eq("link_slot", slot);

      if (clearError) throw clearError;

      // Then assign the new product to the slot
      const { error: assignError } = await supabase
        .from("products")
        .update({ link_slot: slot })
        .eq("id", productId);

      if (assignError) throw assignError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["link-slots"] });
      queryClient.invalidateQueries({ queryKey: ["available-products"] });
      toast.success("Product assigned successfully");
    },
    onError: (error) => {
      toast.error(`Failed to assign product: ${error.message}`);
    },
  });

  return {
    linkSlots,
    isLoading,
    error,
    assignProduct: (slot: number, productId: string) => 
      assignProductMutation.mutate({ slot, productId }),
    isAssigning: assignProductMutation.isPending,
  };
};