import { Product } from "./product";
import { DateRange as DayPickerDateRange } from "react-day-picker";

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

// Use the DateRange type from react-day-picker
export type DateRange = DayPickerDateRange;