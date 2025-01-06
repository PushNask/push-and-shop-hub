export type DeliveryOption = 'pickup' | 'shipping' | 'both';
export type ListingType = 'standard' | 'featured';

export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  category: string;
  images?: string[];
  status?: string;
  expiry?: string;
  link_slot?: number;
  created_at?: string;
  delivery_option: DeliveryOption;
  listingType?: ListingType;
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
}

export interface AddProductFormValues {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  delivery_option: DeliveryOption;
  listingType: ListingType;
  duration: string;
}