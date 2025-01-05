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
  pickup?: boolean;
  shipping?: boolean;
  both?: boolean;
  seller?: {
    email: string;
    country: string;
    phone?: string;
  };
}

export type ProductRow = Omit<Product, 'seller'>;

export const transformProduct = (product: ProductRow & { 
  profiles?: { 
    email: string;
    country: string;
    phone: string;
  } 
}): Product => {
  return {
    ...product,
    seller: product.profiles ? {
      email: product.profiles.email,
      country: product.profiles.country,
      phone: product.profiles.phone
    } : undefined
  };
};