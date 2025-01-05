import type { Database } from "@/integrations/supabase/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export interface Product extends ProductRow {
  seller_email?: string;
  seller_country?: string;
  listingType: "featured" | "standard";
}