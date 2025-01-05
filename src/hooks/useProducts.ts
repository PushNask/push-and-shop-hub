import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";

export const useProducts = (page = 1, limit = 12) => {
  return useQuery({
    queryKey: ["products", page, limit],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      
      // Fetch featured products (slots 1-12)
      const { data: featuredProducts, error: featuredError } = await supabase
        .from("featured_products")
        .select("*")
        .order("link_slot", { ascending: true });

      if (featuredError) throw featuredError;

      // Fetch standard products with pagination (slots 13-120)
      const { data: standardProducts, error: standardError, count } = await supabase
        .from("standard_products")
        .select("*", { count: "exact" })
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (standardError) throw standardError;

      return {
        featured: featuredProducts as Product[],
        standard: standardProducts as Product[],
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page,
      };
    },
  });
};