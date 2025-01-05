import type { Database } from "@/integrations/supabase/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export interface Product extends ProductRow {
  listingType?: "featured" | "standard";
  seller?: {
    name: string;
    location: string;
    rating: number;
    joinedDate: string;
  };
  submittedAt?: string;
}