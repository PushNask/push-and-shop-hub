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
  const handlePrevious = () => {
    setPage(Math.max(1, page - 1));
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={page === 1 || isLoading}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page}
      </span>
      <Button
        variant="outline"
        onClick={handleNext}
        disabled={!hasMore || isLoading}
      >
        Next
      </Button>
    </div>
  );
}