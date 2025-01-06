import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Product } from "@/types/product";

export const useProductList = () => {
  return useQuery({
    queryKey: ["pending-products"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, profiles(*)")
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching pending products:", error);
          throw new Error(error.message);
        }

        return data as Product[];
      } catch (error) {
        console.error("Failed to fetch pending products:", error);
        toast.error("Failed to load pending products", {
          description: "Please check your connection and try again"
        });
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};