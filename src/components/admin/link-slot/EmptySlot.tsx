import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface EmptySlotProps {
  onAssign: () => void;
  onOpenChange: (open: boolean) => void;
}

export function EmptySlot({ onAssign, onOpenChange }: EmptySlotProps) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Product Assigned</h3>
        <p className="text-sm text-muted-foreground">
          This link slot is available for assignment
        </p>
      </div>
      <Button
        className="w-full"
        onClick={() => {
          onAssign();
          onOpenChange(false);
        }}
      >
        Assign Product
      </Button>
    </div>
  );
}