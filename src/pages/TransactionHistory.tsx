import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminNavItems } from "@/components/admin/navigation/AdminNav";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface Transaction {
  id: string;
  seller_id: string;
  product_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  created_at: string;
  seller?: {
    email: string;
    country: string;
  };
}

export default function TransactionHistory() {
  const { toast } = useToast();

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          seller:profiles!transactions_seller_id_fkey(email, country)
        `)
        .order('created_at', { ascending: false });

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

  if (isLoading) {
    return (
      <DashboardLayout title="Transaction History" navItems={adminNavItems}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Transaction History" navItems={adminNavItems}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {formatDate(transaction.created_at)}
                    </TableCell>
                    <TableCell className="font-mono">{transaction.id}</TableCell>
                    <TableCell>{transaction.seller?.email || 'Unknown'}</TableCell>
                    <TableCell>{formatAmount(transaction.amount, transaction.currency)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {transaction.payment_method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}