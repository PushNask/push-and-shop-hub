import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LinkManagementTableRowProps {
  slot: number;
  product?: any;
  onAssign: (slot: number) => void;
  isLoading?: boolean;
}

export function LinkManagementTableRow({
  slot,
  product,
  onAssign,
  isLoading,
}: LinkManagementTableRowProps) {
  const { toast } = useToast();
  
  const handleCopyLink = () => {
    const link = `${window.location.origin}/P${slot}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "The permanent link has been copied to your clipboard.",
    });
  };

  return (
    <TableRow>
      <TableCell>P{slot}</TableCell>
      <TableCell>{product?.title || "Available"}</TableCell>
      <TableCell>{product?.status || "N/A"}</TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          disabled={!product}
        >
          Copy Link
        </Button>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAssign(slot)}
          disabled={isLoading}
        >
          {product ? "Change Product" : "Assign Product"}
        </Button>
      </TableCell>
    </TableRow>
  );
}