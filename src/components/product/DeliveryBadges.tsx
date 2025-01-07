import { Store, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DeliveryOption } from "@/types/product";

interface DeliveryBadgesProps {
  delivery_option: DeliveryOption;
}

export function DeliveryBadges({ delivery_option }: DeliveryBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge 
        variant="outline" 
        className={cn(
          "flex items-center gap-1",
          (delivery_option === 'pickup' || delivery_option === 'both') 
            ? "bg-green-100 text-green-800 border-green-200" 
            : "bg-red-100 text-red-800 border-red-200"
        )}
      >
        <Store className="h-3 w-3" />
        Pickup
      </Badge>
      <Badge 
        variant="outline" 
        className={cn(
          "flex items-center gap-1",
          (delivery_option === 'shipping' || delivery_option === 'both')
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-red-100 text-red-800 border-red-200"
        )}
      >
        <Truck className="h-3 w-3" />
        Shipping
      </Badge>
    </div>
  );
}