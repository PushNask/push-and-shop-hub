import { Store, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DeliveryBadgesProps {
  deliveryOptions?: {
    pickup: boolean;
    shipping: boolean;
    both: boolean;
  };
}

export function DeliveryBadges({ deliveryOptions }: DeliveryBadgesProps) {
  if (!deliveryOptions) return null;

  return (
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
  );
}