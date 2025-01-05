import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProductActionsProps {
  status: string;
  isLoading: boolean;
  onRelist: () => void;
  onRemove: () => void;
}

export const ProductActions = ({ status, isLoading, onRelist, onRemove }: ProductActionsProps) => {
  return (
    <div className="mt-2 flex gap-2 justify-end">
      {status === "expired" && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRelist}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Relist
        </Button>
      )}
      <Button
        variant="destructive"
        size="sm"
        onClick={onRemove}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Remove
      </Button>
    </div>
  );
};