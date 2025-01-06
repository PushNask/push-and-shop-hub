import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LinkActionsProps {
  slot: number;
  onAssign: () => void;
  onOpenChange: (open: boolean) => void;
}

export function LinkActions({ slot, onAssign, onOpenChange }: LinkActionsProps) {
  const { toast } = useToast();

  const handleCopyLink = () => {
    const link = `${window.location.origin}/P${slot}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "The permanent link has been copied to your clipboard",
    });
  };

  const handleVisitLink = () => {
    window.open(`/P${slot}`, '_blank');
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleCopyLink}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleVisitLink}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Visit Link
        </Button>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onAssign();
          onOpenChange(false);
        }}
      >
        Replace Product
      </Button>
    </div>
  );
}