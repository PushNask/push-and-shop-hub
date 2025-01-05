import { Button } from "@/components/ui/button";
import { Facebook, Twitter, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  seller?: {
    phone?: string;
  };
}

export function ShareButtons({ title, seller }: ShareButtonsProps) {
  const shareUrl = window.location.href;
  const shareText = `Check out ${title} on PushNshop!`;

  const shareHandlers = {
    whatsapp: () => {
      if (!seller?.phone) {
        toast.error("Seller contact information not available");
        return;
      }
      const message = `Hi, I'm interested in your product: ${title}. Can you provide more details?`;
      const whatsappUrl = `https://wa.me/${seller.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      toast.success("Opening WhatsApp...");
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
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareHandlers.whatsapp}
        className="flex-1"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        WhatsApp
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareHandlers.facebook}
        className="flex-1"
      >
        <Facebook className="h-4 w-4 mr-2" />
        Facebook
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareHandlers.twitter}
        className="flex-1"
      >
        <Twitter className="h-4 w-4 mr-2" />
        Twitter
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareHandlers.copyLink}
        className="flex-1"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Copy Link
      </Button>
    </div>
  );
}