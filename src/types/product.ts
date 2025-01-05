export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  category: string;
  images?: string[];
  status: string;
  expiry: string;
  link_slot: number;
  seller?: {
    email: string;
    country: string;
  };
  created_at?: string;
}