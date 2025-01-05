import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart, ChartTooltip, ChartTooltipContent } from "@/components/ui/charts";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { Eye, MessageCircle, Package, TrendingUp, Loader2 } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SellerAnalytics = () => {
  const [sellerId, setSellerId] = useState<string | null>(null);
  
  useEffect(() => {
    const getSellerProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setSellerId(session.user.id);
      }
    };
    
    getSellerProfile();
  }, []);

  const { data: analyticsData, isLoading, error } = useAnalytics(sellerId);

  if (error) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <p className="text-red-500">Failed to load analytics data</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  const latestAnalytics = analyticsData?.[0] || {
    total_views: 0,
    total_chats: 0,
    active_products: 0,
    total_revenue: 0
  };

  const weeklyData = analyticsData?.slice(0, 7).reverse() || [];

  const chartConfig = {
    views: {
      label: "Views",
      color: "#3b82f6"
    },
    chats: {
      label: "Chats",
      color: "#10b981"
    },
    revenue: {
      label: "Revenue",
      color: "#6366f1"
    }
  };

  return (
    <div className="container py-6 space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${isLoading ? 'opacity-50' : ''}`}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                latestAnalytics.total_views.toLocaleString()
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                latestAnalytics.active_products.toLocaleString()
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                latestAnalytics.total_chats.toLocaleString()
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'XAF'
                }).format(latestAnalytics.total_revenue)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Chart config={chartConfig}>
                <LineChart data={weeklyData}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="total_views"
                    name="Views"
                    stroke={chartConfig.views.color}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="total_chats"
                    name="Chats"
                    stroke={chartConfig.chats.color}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="total_revenue"
                    name="Revenue"
                    stroke={chartConfig.revenue.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </Chart>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerAnalytics;