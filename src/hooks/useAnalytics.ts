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
      try {
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

        if (!data || data.length === 0) {
          return [];
        }

        return data as AnalyticsData[];
      } catch (error) {
        console.error('Analytics fetch error:', error);
        toast({
          variant: "destructive",
          title: "Error fetching analytics",
          description: "Failed to load analytics data. Please try again.",
        });
        throw error;
      }
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 240000, // Consider data stale after 4 minutes
  });
}