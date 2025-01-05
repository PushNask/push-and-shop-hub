import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductRow, transformProduct } from "@/types/product";

export const useProductList = () => {
  return useQuery({
    queryKey: ["pending-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, profiles(*)")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch pending products");
        throw error;
      }

      return data.map(transformProduct);
    },
  });
};