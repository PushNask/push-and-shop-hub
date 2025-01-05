import { Calendar, DollarSign } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/types/transaction";

interface PaymentHistoryTableProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  formatDate: (dateString: string) => string;
  formatAmount: (amount: number, currency?: string) => string;
  getStatusColor: (status: string) => string;
}

export function PaymentHistoryTable({
  transactions,
  isLoading,
  formatDate,
  formatAmount,
  getStatusColor,
}: PaymentHistoryTableProps) {
  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (!transactions?.length) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="h-24 text-center">
          No transactions found
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableBody>
      {transactions.map((transaction) => (
        <TableRow key={transaction.id}>
          <TableCell className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            {formatDate(transaction.created_at)}
          </TableCell>
          <TableCell className="font-mono text-sm">
            {transaction.id.slice(0, 8)}...
          </TableCell>
          <TableCell>
            {transaction.products?.title || 'Unknown Product'}
          </TableCell>
          <TableCell>
            {formatAmount(transaction.amount, transaction.currency)}
          </TableCell>
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
  );
}