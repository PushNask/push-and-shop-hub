import { Product } from "./product";

export interface Transaction {
  id: string;
  seller_id: string;
  product_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  created_at: string;
  products?: {
    title: string;
  };
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}