import { FormLabel } from "@/components/ui/form";
import { DeliveryOption } from "./delivery/DeliveryOption";
import { DeliveryValidation } from "./delivery/DeliveryValidation";
import type { DeliveryOption as DeliveryOptionType } from "@/types/product";

interface DeliveryOptionsSectionProps {
  form: any;
}

export function DeliveryOptionsSection({ form }: DeliveryOptionsSectionProps) {
  const delivery_option = form.watch("delivery_option") as DeliveryOptionType;

  return (
    <div className="space-y-3">
      <FormLabel>Delivery Options</FormLabel>
      <div className="flex flex-col gap-4">
        <DeliveryOption
          form={form}
          name="delivery_option"
          label="Pickup Available"
          description="Buyers can pick up the product from your location"
          checked={delivery_option === 'pickup'}
          onCheckedChange={() => form.setValue("delivery_option", "pickup")}
        />
        <DeliveryOption
          form={form}
          name="delivery_option"
          label="Shipping Available"
          description="You can ship the product to buyers"
          checked={delivery_option === 'shipping'}
          onCheckedChange={() => form.setValue("delivery_option", "shipping")}
        />
        <DeliveryOption
          form={form}
          name="delivery_option"
          label="Both Options Available"
          description="Offer both pickup and shipping options to buyers"
          checked={delivery_option === 'both'}
          onCheckedChange={() => form.setValue("delivery_option", "both")}
        />
      </div>
      <DeliveryValidation showError={!delivery_option} />
    </div>
  );
}