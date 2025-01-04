import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, LineChart, Line } from "recharts";
import { AlertCircle, BarChart3, CircleDollarSign, Users } from "lucide-react";

// Mock data - replace with real API calls later
const mockAnalytics = {
  activeVisitors: 342,
  weeklyRevenue: 1500,
  pendingApprovals: 12,
  topCategories: [
    { name: 'Electronics', value: 45 },
    { name: 'Fashion', value: 35 },
    { name: 'Home & Furniture', value: 25 },
    { name: 'Beauty', value: 20 },
    { name: 'Sports', value: 15 }
  ],
  recentActivity: [
    { action: 'Approved', product: 'iPhone 13 Pro', timestamp: '2024-01-01 10:00' },
    { action: 'Rejected', product: 'Samsung Galaxy S24', timestamp: '2024-01-01 09:30' },
    { action: 'New Listing', product: 'Nike Air Max', timestamp: '2024-01-01 09:00' },
    { action: 'Approved', product: 'Sony PlayStation 5', timestamp: '2024-01-01 08:45' },
  ],
  weeklyTrends: [
    { date: 'Mon', revenue: 200, visitors: 150 },
    { date: 'Tue', revenue: 300, visitors: 200 },
    { date: 'Wed', revenue: 400, visitors: 300 },
    { date: 'Thu', revenue: 500, visitors: 250 },
    { date: 'Fri', revenue: 600, visitors: 400 },
    { date: 'Sat', revenue: 800, visitors: 500 },
    { date: 'Sun', revenue: 1000, visitors: 600 }
  ]
};

const MetricCard = ({ title, value, icon: Icon, bgColor }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  bgColor: string;
}) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 ${bgColor} rounded-full`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminAnalytics = () => {
  return (
    <div className="container mx-auto p-6 space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Visitors"
          value={mockAnalytics.activeVisitors}
          icon={Users}
          bgColor="bg-blue-100"
        />
        <MetricCard
          title="Weekly Revenue"
          value={`$${mockAnalytics.weeklyRevenue}`}
          icon={CircleDollarSign}
          bgColor="bg-green-100"
        />
        <MetricCard
          title="Pending Approvals"
          value={mockAnalytics.pendingApprovals}
          icon={AlertCircle}
          bgColor="bg-yellow-100"
        />
        <MetricCard
          title="Total Products"
          value="120"
          icon={BarChart3}
          bgColor="bg-purple-100"
        />
      </div>

      {/* Weekly Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(142, 76%, 36%)",
                },
                visitors: {
                  label: "Visitors",
                  color: "hsl(221, 83%, 53%)",
                },
              }}
            >
              <LineChart data={mockAnalytics.weeklyTrends}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="hsl(221, 83%, 53%)"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  value: {
                    label: "Products",
                    color: "hsl(221, 83%, 53%)",
                  },
                }}
              >
                <BarChart data={mockAnalytics.topCategories}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(221, 83%, 53%)" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {activity.action} - {activity.product}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;