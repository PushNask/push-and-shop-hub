import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  listingType: "featured" | "standard";
  seller: {
    name: string;
    location: string;
    rating: number;
    joinedDate: string;
  };
}

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
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
          
          <div className="grid gap-2">
            <h4 className="font-semibold">Seller Information</h4>
            <div className="text-sm space-y-1">
              <p>Name: {product.seller.name}</p>
              <p>Location: {product.seller.location}</p>
              <p>Rating: {product.seller.rating}/5</p>
              <p>Member since: {formatDate(product.seller.joinedDate)}</p>
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="feedback" className="font-semibold">Feedback</label>
            <Textarea
              id="feedback"
              placeholder="Enter feedback for the seller (optional)"
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button
            variant="destructive"
            onClick={() => onAction("reject")}
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