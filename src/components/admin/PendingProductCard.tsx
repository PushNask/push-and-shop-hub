import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin, Clock, Package, Star } from "lucide-react";
import { Product } from "@/types/product";

interface PendingProductCardProps {
  product: Product;
  onReview: (product: Product) => void;
}

export const PendingProductCard = ({ product, onReview }: PendingProductCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow animate-fadeIn">
      <CardContent className="p-6">
        <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight">{product.title}</h3>
            <Badge variant={product.listingType === "featured" ? "default" : "secondary"} className="shrink-0">
              {product.listingType || "standard"}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">{product.profiles?.email || "Unknown Seller"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{product.profiles?.country || "Unknown Location"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Submitted: {formatDate(product.created_at || new Date().toISOString())}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-semibold">
              <Package className="h-4 w-4" />
              <span>{formatPrice(product.price)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4" />
              <span>Slot {product.link_slot || "N/A"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {product.pickup && (
              <Badge variant="outline">Pickup</Badge>
            )}
            {product.shipping && (
              <Badge variant="outline">Shipping</Badge>
            )}
            {product.both && (
              <Badge variant="outline">Pickup & Shipping</Badge>
            )}
          </div>
          
          <Button 
            className="w-full mt-4" 
            onClick={() => onReview(product)}
          >
            Review Product
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};