import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AnalyticsData {
  id: string;
  date: string;
  total_views: number;
  total_chats: number;
  total_revenue: number;
  active_products: number;
  pending_approvals: number;
  seller_id: string | null;
}

export function useAnalytics(sellerId?: string) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['analytics', sellerId],
    queryFn: async () => {
      let query = supabase
        .from('analytics')
        .select('*')
        .order('date', { ascending: false });

      if (sellerId) {
        query = query.eq('seller_id', sellerId);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching analytics",
          description: error.message,
        });
        throw error;
      }

      return data as AnalyticsData[];
    },
  });
}