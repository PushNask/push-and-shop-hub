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
    whatsapp: (e: React.MouseEvent) => {
      e.preventDefault();
      if (!seller?.phone) {
        toast.error("Seller contact information not available");
        return;
      }
      const message = `Hi, I'm interested in your product: ${title}. Can you provide more details?`;
      const whatsappUrl = `https://wa.me/${seller.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      toast.success("Opening WhatsApp...");
    },
    facebook: (e: React.MouseEvent) => {
      e.preventDefault();
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      toast.success("Opening Facebook...");
    },
    twitter: (e: React.MouseEvent) => {
      e.preventDefault();
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      toast.success("Opening Twitter...");
    },
    copyLink: async (e: React.MouseEvent) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareHandlers.whatsapp}
        className="bg-background/50 backdrop-blur-sm"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareHandlers.facebook}
        className="bg-background/50 backdrop-blur-sm"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareHandlers.twitter}
        className="bg-background/50 backdrop-blur-sm"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareHandlers.copyLink}
        className="bg-background/50 backdrop-blur-sm"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}