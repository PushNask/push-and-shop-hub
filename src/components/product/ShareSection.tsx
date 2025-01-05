import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Share2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/product";

interface ShareSectionProps {
  product: Product;
  shareUrl: string;
}

export const ShareSection = ({ product, shareUrl }: ShareSectionProps) => {
  const shareText = `Check out ${product.title} on PushNshop!`;

  const shareHandlers = {
    message: () => {
      if (product.profiles?.phone) {
        const message = encodeURIComponent(`Hi, I'm interested in your product: ${product.title}`);
        window.open(`https://wa.me/${product.profiles.phone}?text=${message}`, '_blank');
        toast.success("Opening WhatsApp...");
      } else {
        toast.error("Seller's contact information is not available");
      }
    },
    facebook: () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      toast.success("Opening Facebook...");
    },
    twitter: () => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      toast.success("Opening Twitter...");
    },
    copyLink: async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={shareHandlers.message}>
        <MessageCircle className="mr-2 h-4 w-4" />
        WhatsApp
      </Button>
      <Button variant="outline" onClick={shareHandlers.facebook}>
        <Facebook className="mr-2 h-4 w-4" />
        Facebook
      </Button>
      <Button variant="outline" onClick={shareHandlers.twitter}>
        <Twitter className="mr-2 h-4 w-4" />
        Twitter
      </Button>
      <Button variant="outline" onClick={shareHandlers.copyLink}>
        <Share2 className="mr-2 h-4 w-4" />
        Copy Link
      </Button>
    </div>
  );
};