import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Clock, 
  Truck, 
  Store 
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface ProductCardProps {
  title: string;
  price: number;
  images?: string[];
  className?: string;
  seller?: {
    phone?: string;
    country?: string;
  };
  expiry?: string;
  deliveryOptions?: {
    pickup: boolean;
    shipping: boolean;
    both: boolean;
  };
  category?: string;
}

export function ProductCard({ 
  title, 
  price, 
  images, 
  className,
  seller,
  expiry,
  deliveryOptions,
  category 
}: ProductCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const shareUrl = window.location.href;
  const shareText = `Check out ${title} on PushNshop!`;

  // Calculate time remaining until expiry
  useEffect(() => {
    if (!expiry) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiry).getTime();
      const distance = expiryTime - now;
      
      if (distance < 0) {
        setTimeLeft("EXPIRED");
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiry]);

  const shareHandlers = {
    message: (e: React.MouseEvent) => {
      e.preventDefault();
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
    },
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
            src={images?.[0] || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-sm sm:text-base truncate">{title}</h3>
            {category && (
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">XAF {price.toLocaleString()}</p>
          
          {seller?.country && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{seller.country}</span>
            </div>
          )}
          
          {timeLeft && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{timeLeft}</span>
            </div>
          )}

          {deliveryOptions && (
            <div className="flex flex-wrap gap-2">
              {(deliveryOptions.pickup || deliveryOptions.both) && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Store className="h-3 w-3" />
                  Pickup
                </Badge>
              )}
              {(deliveryOptions.shipping || deliveryOptions.both) && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  Shipping
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
      
      {/* Action buttons - Appear on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-background/0 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
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
      </div>
    </div>
  );
}