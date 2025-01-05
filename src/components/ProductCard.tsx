import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { DeliveryBadges } from "./product/DeliveryBadges";
import { ShareButtons } from "./product/ShareButtons";

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

  // Calculate time remaining until expiry
  useEffect(() => {
    if (!expiry) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiry).getTime();
      const distance = expiryTime - now;
      
      if (distance < 0) {
        setTimeLeft("EXPIRED");
        return null; // Return null to clear interval
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft() || "EXPIRED");

    // Update every second
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (remaining === null) {
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiry]);

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

          <DeliveryBadges deliveryOptions={deliveryOptions} />
        </div>
      </Link>
      
      {/* Action buttons - Appear on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-background/0 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        <ShareButtons title={title} seller={seller} />
      </div>
    </div>
  );
}