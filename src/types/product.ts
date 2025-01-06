export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  status: string;
  expiry: string;
  link_slot: number;
  created_at?: string;
  listingType: "featured" | "standard";
  profiles?: {
    email: string;
    country: string;
    phone?: string;
  };
  seller?: {
    email: string;
    country: string;
    phone?: string;
    name?: string;
    location?: string;
    rating?: number;
    joinedDate?: string;
  };
  delivery_option: 'pickup' | 'shipping' | 'both';
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
    listingType: product.link_slot && product.link_slot <= 12 ? "featured" : "standard",
    seller: product.profiles ? {
      email: product.profiles.email,
      country: product.profiles.country,
      phone: product.profiles.phone,
      name: "Unknown Seller",
      location: product.profiles.country || "Unknown Location",
      rating: 0,
      joinedDate: product.created_at || new Date().toISOString()
    } : undefined
  };
};

export interface AddProductFormValues {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  delivery_option: 'pickup' | 'shipping' | 'both';
  listingType: "standard" | "featured";
  duration: string;
}