import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { adminNavItems } from "@/components/admin/navigation/AdminNav";
import { Chart, ChartTooltip, ChartTooltipContent } from "@/components/ui/charts";
import { Users, DollarSign, ShoppingBag, Clock, Loader2 } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

export default function AdminAnalytics() {
  const { data: analyticsData, isLoading, error } = useAnalytics();

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

  if (error) {
    return (
      <DashboardLayout title="Analytics Dashboard" navItems={adminNavItems}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <p className="text-red-500">Failed to load analytics data</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analytics Dashboard" navItems={adminNavItems}>
      <div className={cn(
        "space-y-4 animate-in fade-in duration-500",
        isLoading && "opacity-50 pointer-events-none"
      )}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  latestAnalytics.pending_approvals.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
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
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
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
                  <Chart
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "#8884d8"
                      },
                      views: {
                        label: "Views",
                        color: "#82ca9d"
                      }
                    }}
                  >
                    <AreaChart data={weeklyChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </Chart>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {weeklyData.length > 0 ? (
                    weeklyData.map((data) => (
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
                            {data.total_views.toLocaleString()} views • {data.total_chats.toLocaleString()} chats
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground">
                      No recent activity to display
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}