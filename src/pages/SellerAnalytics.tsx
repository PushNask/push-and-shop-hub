import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/charts";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Eye, MessageCircle, Package, TrendingUp } from "lucide-react";

// Mock data - replace with actual data fetching
const analyticsData = {
  totalViews: 1250,
  activeProducts: 8,
  totalChats: 45,
  conversionRate: 3.6,
  weeklyStats: [
    { date: "Mon", views: 150, chats: 5, sales: 1 },
    { date: "Tue", views: 230, chats: 8, sales: 2 },
    { date: "Wed", views: 180, chats: 6, sales: 1 },
    { date: "Thu", views: 290, chats: 12, sales: 3 },
    { date: "Fri", views: 340, chats: 15, sales: 4 },
    { date: "Sat", views: 270, chats: 10, sales: 2 },
    { date: "Sun", views: 200, chats: 7, sales: 1 }
  ]
};

const chartConfig = {
  views: {
    label: "Views",
    color: "#3b82f6"
  },
  chats: {
    label: "Chats",
    color: "#10b981"
  },
  sales: {
    label: "Sales",
    color: "#6366f1"
  }
};

const SellerAnalytics = () => {
  return (
    <div className="container py-6 space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.activeProducts}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.activeProducts} products live
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalChats}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <LineChart data={analyticsData.weeklyStats}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload) return null;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          {payload.map((entry) => (
                            <div key={entry.name} className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {entry.name}
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke={chartConfig.views.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="chats"
                  stroke={chartConfig.chats.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke={chartConfig.sales.color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerAnalytics;