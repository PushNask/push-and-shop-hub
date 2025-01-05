import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { adminNavItems } from "@/components/admin/navigation/AdminNav";
import { Chart } from "@/components/ui/chart";
import { Users, DollarSign, ShoppingBag, Clock } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AdminAnalytics() {
  const { data: analyticsData, isLoading } = useAnalytics();

  const latestAnalytics = analyticsData?.[0] || {
    total_views: 0,
    total_revenue: 0,
    pending_approvals: 0,
    active_products: 0,
  };

  const weeklyData = analyticsData?.slice(0, 7).reverse() || [];

  const weeklyChartData = weeklyData.map((data) => ({
    name: new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: data.total_revenue,
    views: data.total_views,
  }));

  if (isLoading) {
    return (
      <DashboardLayout title="Analytics Dashboard" navItems={adminNavItems}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analytics Dashboard" navItems={adminNavItems}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestAnalytics.total_views}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XAF'
              }).format(latestAnalytics.total_revenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestAnalytics.pending_approvals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestAnalytics.active_products}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="line"
              data={weeklyChartData}
              categories={['revenue', 'views']}
              index="name"
              colors={['blue', 'green']}
              valueFormatter={(value: number) => 
                value.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'XAF',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              }
              className="h-[300px]"
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((data, index) => (
                <div key={data.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {new Date(data.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {data.total_views} views • {data.total_chats} chats
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}