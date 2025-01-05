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

export type ProductRow = Product;

export const transformProduct = (product: ProductRow & { 
  profiles?: { 
    email: string;
    country: string;
  } 
}): Product => {
  return {
    ...product,
    listingType: product.link_slot && product.link_slot <= 12 ? "featured" : "standard",
    seller: product.profiles ? {
      email: product.profiles.email,
      country: product.profiles.country
    } : undefined
  };
};