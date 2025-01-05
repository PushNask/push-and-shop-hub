import { Button } from "@/components/ui/button";

interface PaymentHistoryPaginationProps {
  page: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  hasMore: boolean;
}

export function PaymentHistoryPagination({
  page,
  setPage,
  isLoading,
  hasMore,
}: PaymentHistoryPaginationProps) {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1 || isLoading}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page}
      </span>
      <Button
        variant="outline"
        onClick={() => setPage(p => p + 1)}
        disabled={!hasMore || isLoading}
      >
        Next
      </Button>
    </div>
  );
}