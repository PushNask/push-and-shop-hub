export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description?: string;  // Made optional to match database schema
  price: number;
  currency: string;
  category: string;
  images?: string[];
  status: string;
  expiry: string;
  link_slot: number;
  created_at?: string;
  listingType?: "featured" | "standard";
  seller?: {
    email: string;
    country: string;
  };
}

export type ProductRow = Omit<Product, 'listingType'>;

export const transformProduct = (product: ProductRow & { 
  seller_email?: string; 
  seller_country?: string; 
}): Product => {
  return {
    ...product,
    listingType: product.link_slot && product.link_slot <= 12 ? "featured" : "standard",
    seller: product.seller_email ? {
      email: product.seller_email,
      country: product.seller_country || "Unknown"
    } : undefined
  };
};