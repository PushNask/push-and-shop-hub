import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  title: string;
  price: number;
  image?: string; // Made optional to match database type
  className?: string;
}

export function ProductCard({ title, price, image, className }: ProductCardProps) {
  const shareUrl = window.location.href;
  const shareText = `Check out ${title} on PushNshop!`;

  const shareHandlers = {
    message: (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation
      window.open(`sms:?body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
      toast.success("Opening messaging app...");
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
    <div className={cn(
      "group relative overflow-hidden rounded-lg hover-lift glass-card h-full",
      "transition-all duration-300 hover:shadow-lg",
      className
    )}>
      <Link to={`/p/${title.toLowerCase().replace(/\s+/g, '-')}/details`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm sm:text-base truncate">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">XAF {price.toLocaleString()}</p>
        </div>
      </Link>
      
      {/* Share buttons - Appear on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-background/0 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        <div className="flex flex-wrap gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={shareHandlers.message}
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
      </div>
    </div>
  );
}