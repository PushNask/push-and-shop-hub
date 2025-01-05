import type { Database } from "@/integrations/supabase/types";

export interface Product extends Database["public"]["Tables"]["products"]["Row"] {
  listingType?: "featured" | "standard";
  seller?: {
    name: string;
    location: string;
    rating: number;
    joinedDate: string;
  };
  submittedAt?: string;
}