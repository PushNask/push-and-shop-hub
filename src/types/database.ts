// Database specific types
export type DeliveryOption = 'pickup' | 'shipping' | 'both';

export interface DatabaseProduct {
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
  delivery_option: DeliveryOption;
}