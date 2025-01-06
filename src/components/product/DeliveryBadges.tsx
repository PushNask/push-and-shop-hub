import { Badge } from "@/components/ui/badge";
import { Package, Truck, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryBadgesProps {
  deliveryOptions?: {
    pickup: boolean;
    shipping: boolean;
    both: boolean;
  };
  className?: string;
}

export function DeliveryBadges({ deliveryOptions, className }: DeliveryBadgesProps) {
  if (!deliveryOptions) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {deliveryOptions.pickup && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Package className="h-3 w-3" />
          <span className="text-xs">Pickup</span>
        </Badge>
      )}
      {deliveryOptions.shipping && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Truck className="h-3 w-3" />
          <span className="text-xs">Shipping</span>
        </Badge>
      )}
      {deliveryOptions.both && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Home className="h-3 w-3" />
          <span className="text-xs">Both</span>
        </Badge>
      )}
    </div>
  );
}