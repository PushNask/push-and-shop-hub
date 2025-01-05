import type { Database } from "@/integrations/supabase/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export interface Product extends ProductRow {
  seller_email?: string;
  seller_country?: string;
  listingType: "featured" | "standard";
  seller?: {
    name: string;
    location: string;
    rating: number;
    joinedDate: string;
  };
  image?: string;
}

export const transformProduct = (product: ProductRow & { 
  seller_email?: string; 
  seller_country?: string; 
}): Product => {
  return {
    ...product,
    listingType: product.link_slot && product.link_slot <= 12 ? "featured" : "standard",
    image: product.images?.[0],
    seller: product.seller_email ? {
      name: product.seller_email,
      location: product.seller_country || "Unknown",
      rating: 0,
      joinedDate: product.created_at || new Date().toISOString()
    } : undefined
  };
};