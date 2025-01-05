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
  image?: string; // For backward compatibility
}

// Helper function to transform database product to component product
export const transformProduct = (product: ProductRow & { 
  seller_email?: string; 
  seller_country?: string; 
}): Product => {
  return {
    ...product,
    listingType: product.link_slot && product.link_slot <= 12 ? "featured" : "standard",
    image: product.images?.[0], // Use first image as main image
    seller: {
      name: product.seller_email || "Unknown",
      location: product.seller_country || "Unknown",
      rating: 0,
      joinedDate: product.created_at || new Date().toISOString()
    }
  };
};