import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { MapPin, Clock, Shield, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { DeliveryBadges } from "./product/DeliveryBadges";
import { ProductCardImage } from "./product/ProductCardImage";
import { useTimeLeft } from "@/hooks/useTimeLeft";
import { openWhatsAppChat } from "@/utils/contact";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  images?: string[];
  className?: string;
  seller?: {
    phone?: string;
    country?: string;
    name?: string;
    email?: string;
  };
  expiry?: string;
  deliveryOptions: {
    pickup: boolean;
    shipping: boolean;
    both: boolean;
  };
  category?: string;
  description?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export function ProductCard({ 
  id,
  title, 
  price, 
  images, 
  className,
  seller,
  expiry,
  deliveryOptions,
  category,
  description,
  status = 'pending'
}: ProductCardProps) {
  const timeLeft = useTimeLeft(expiry);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openWhatsAppChat(seller?.phone, title);
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-lg hover-lift glass-card h-full",
        "transition-all duration-300 hover:shadow-lg",
        className
      )}
      role="article"
      aria-label={`Product: ${title}`}
    >
      <Link to={`/products/${id}`} className="block">
        <div className="aspect-square overflow-hidden bg-muted">
          <ProductCardImage 
            src={images?.[0]} 
            alt={`Product image for ${title}`} 
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
          
          <p className="text-sm text-muted-foreground">
            XAF {price.toLocaleString()}
          </p>
          
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          {seller?.country && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>{seller.country}</span>
            </div>
          )}
          
          {timeLeft && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>{timeLeft}</span>
            </div>
          )}

          {status === 'approved' && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Shield className="h-4 w-4" aria-hidden="true" />
              <span>Verified Listing</span>
            </div>
          )}

          <DeliveryBadges deliveryOptions={deliveryOptions} />
        </div>
      </Link>
      
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-background/0 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0"
      >
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-background/50 backdrop-blur-sm"
          onClick={handleWhatsAppClick}
          aria-label={`Contact seller about ${title}`}
        >
          <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
          Contact Seller
        </Button>
      </div>
    </div>
  );
}