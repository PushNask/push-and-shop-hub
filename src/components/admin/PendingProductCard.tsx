import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin, Clock, Package } from "lucide-react";
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold truncate">{product.title}</h3>
            <Badge variant={product.listingType === "featured" ? "default" : "secondary"}>
              {product.listingType}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground truncate">
            {product.description}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{product.seller?.email || "Unknown Seller"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{product.seller?.country || "Unknown Location"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Submitted: {formatDate(product.created_at || new Date().toISOString())}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Package className="h-4 w-4" />
            <span>{formatPrice(product.price)}</span>
          </div>
          
          <Button 
            className="w-full mt-4" 
            onClick={() => onReview(product)}
          >
            Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};