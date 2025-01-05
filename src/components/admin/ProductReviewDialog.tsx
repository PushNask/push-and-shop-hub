import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";
import { Product } from "@/types/product";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { toast } from "sonner";

interface ProductReviewDialogProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  onAction: (action: "approve" | "reject") => void;
}

export const ProductReviewDialog = ({
  product,
  isOpen,
  onOpenChange,
  feedback,
  onFeedbackChange,
  onAction,
}: ProductReviewDialogProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Product Listing</DialogTitle>
          <DialogDescription>
            Review the details below and approve or reject the listing
          </DialogDescription>
        </DialogHeader>
        
        <ErrorBoundary>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <h3 className="font-semibold">{product.title}</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              
              {product.images && product.images.length > 0 && (
                <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <h4 className="font-semibold">Seller Information</h4>
              <div className="text-sm space-y-1">
                <p>Email: {product.seller?.email || 'Unknown'}</p>
                <p>Location: {product.seller?.location || product.seller?.country || 'Unknown'}</p>
                <p>Rating: {product.seller?.rating || 0}/5</p>
                <p>Member since: {formatDate(product.seller?.joinedDate || product.created_at || new Date().toISOString())}</p>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="feedback" className="font-semibold">Feedback</label>
              <Textarea
                id="feedback"
                placeholder="Enter feedback for the seller (required for rejections)"
                value={feedback}
                onChange={(e) => onFeedbackChange(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </ErrorBoundary>
        
        <DialogFooter className="flex gap-2">
          <Button
            variant="destructive"
            onClick={() => {
              if (!feedback && product.status !== 'approved') {
                toast.error("Please provide feedback when rejecting a product");
                return;
              }
              onAction("reject");
            }}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
          <Button
            onClick={() => onAction("approve")}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
