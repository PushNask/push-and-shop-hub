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
    <div className="absolute bottom-4 left-4 right-4 flex gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
      {status === "expired" && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRelist}
          disabled={isLoading}
          className="flex-1"
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
        className="flex-1"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Remove
      </Button>
    </div>
  );
};