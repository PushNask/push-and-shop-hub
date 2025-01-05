import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { DateRange, Transaction } from "@/types/transaction";
import { addDays } from "date-fns";
import { PaymentHistoryFilters } from "@/components/payment-history/PaymentHistoryFilters";
import { PaymentHistoryTable } from "@/components/payment-history/PaymentHistoryTable";
import { PaymentHistoryPagination } from "@/components/payment-history/PaymentHistoryPagination";

const navItems = [
  {
    title: "Payment History",
    href: "/payment-history",
    icon: DollarSign
  }
];

export default function PaymentHistory() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', page, searchQuery, statusFilter, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          products (title)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      if (searchQuery) {
        query = query.ilike('products.title', `%${searchQuery}%`);
      }

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      if (dateRange.from && dateRange.to) {
        query = query.gte('created_at', dateRange.from.toISOString())
                    .lte('created_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching transactions",
          description: error.message,
        });
        throw error;
      }

      return data as Transaction[];
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number, currency: string = "XAF") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <DashboardLayout title="Payment History" navItems={navItems}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PaymentHistoryFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <PaymentHistoryTable
                  transactions={transactions}
                  isLoading={isLoading}
                  formatDate={formatDate}
                  formatAmount={formatAmount}
                  getStatusColor={getStatusColor}
                />
              </Table>
            </div>

            <PaymentHistoryPagination
              page={page}
              setPage={setPage}
              isLoading={isLoading}
              hasMore={transactions?.length === itemsPerPage}
            />
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}