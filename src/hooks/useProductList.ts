import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProductList = () => {
  return useQuery({
    queryKey: ["pending-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          seller:profiles(
            name:email,
            location:country,
            rating:is_verified,
            joinedDate:created_at
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch pending products");
        throw error;
      }

      return data.map(product => ({
        ...product,
        seller: {
          name: product.seller.name,
          location: product.seller.location || "Unknown",
          rating: product.seller.rating ? 5 : 3,
          joinedDate: product.seller.joinedDate
        }
      }));
    },
  });
};