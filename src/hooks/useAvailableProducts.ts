import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";

export const useAvailableProducts = () => {
  return useQuery({
    queryKey: ["available-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .is("link_slot", null)
        .eq("status", "approved");

      if (error) throw error;
      return data as Product[];
    },
    enabled: true,
  });
};