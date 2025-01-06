import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ProductTimer } from "./product/ProductTimer";
import { ProductImage } from "./product/ProductImage";
import { ProductHeader } from "./product/ProductHeader";
import { SellerDetails } from "./product/SellerDetails";
import { DeliveryBadges } from "./product/DeliveryBadges";
import { ContactButton } from "./product/ContactButton";

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
  deliveryOptions?: {
    pickup: boolean;
    shipping: boolean;
    both: boolean;
  };
  category?: string;
  description?: string;
  status?: string;
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
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-lg hover-lift glass-card h-full",
      "transition-all duration-300 hover:shadow-lg",
      className
    )}>
      <Link to={`/products/${id}`} className="block">
        <ProductTimer expiry={expiry} />
        <ProductImage image={images?.[0]} title={title} />

        <div className="p-4 space-y-4">
          <ProductHeader title={title} category={category} price={price} />

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}

          <div className="space-y-2 border-t pt-2">
            <SellerDetails seller={seller} status={status} />
            <DeliveryBadges deliveryOptions={deliveryOptions} />
          </div>
        </div>
      </Link>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-background/0 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        <ContactButton seller={seller} title={title} />
      </div>
    </div>
  );
}