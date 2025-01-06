import { Store, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DeliveryOption } from "@/types/product";

interface DeliveryBadgesProps {
  delivery_option: DeliveryOption;
}

export function DeliveryBadges({ delivery_option }: DeliveryBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(delivery_option === 'pickup' || delivery_option === 'both') && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Store className="h-3 w-3" />
          Pickup
        </Badge>
      )}
      {(delivery_option === 'shipping' || delivery_option === 'both') && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Truck className="h-3 w-3" />
          Shipping
        </Badge>
      )}
    </div>
  );
}