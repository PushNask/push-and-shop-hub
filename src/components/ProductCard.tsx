import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ProductCardImage } from "./product/ProductCardImage";
import { ProductTitle } from "./product/ProductTitle";
import { ProductPrice } from "./product/ProductPrice";
import { ProductLocation } from "./product/ProductLocation";
import { ProductStatus } from "./product/ProductStatus";
import { DeliveryBadges } from "./product/DeliveryBadges";
import { ProductContactButton } from "./product/ProductContactButton";
import { ProductCardErrorBoundary } from "./product/ProductCardErrorBoundary";
import { useTimeLeft } from "@/hooks/useTimeLeft";
import { Clock } from "lucide-react";

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
  delivery_option: 'pickup' | 'shipping' | 'both';
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
  delivery_option,
  category,
  status = 'pending'
}: ProductCardProps) {
  const timeLeft = useTimeLeft(expiry);

  return (
    <ProductCardErrorBoundary>
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
            <ProductTitle title={title} category={category} />
            <ProductPrice price={price} />
            <ProductLocation country={seller?.country} />
            
            {timeLeft && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>{timeLeft}</span>
              </div>
            )}

            <ProductStatus status={status} />
            <DeliveryBadges delivery_option={delivery_option} />
          </div>
        </Link>
        
        <ProductContactButton 
          phone={seller?.phone} 
          title={title}
        />
      </div>
    </ProductCardErrorBoundary>
  );
}
