import { FormLabel } from "@/components/ui/form";
import { DeliveryOption } from "./delivery/DeliveryOption";
import { DeliveryValidation } from "./delivery/DeliveryValidation";

interface DeliveryOptionsSectionProps {
  form: any;
}

export function DeliveryOptionsSection({ form }: DeliveryOptionsSectionProps) {
  const pickup = form.watch("pickup");
  const shipping = form.watch("shipping");
  const both = form.watch("both");

  return (
    <div className="space-y-3">
      <FormLabel>Delivery Options</FormLabel>
      <div className="flex flex-col gap-4">
        <DeliveryOption
          form={form}
          name="pickup"
          label="Pickup Available"
          description="Buyers can pick up the product from your location"
          checked={pickup || both}
          onCheckedChange={(checked) => {
            form.setValue("pickup", checked);
            if (both) {
              form.setValue("both", false);
            }
          }}
        />
        <DeliveryOption
          form={form}
          name="shipping"
          label="Shipping Available"
          description="You can ship the product to buyers"
          checked={shipping || both}
          onCheckedChange={(checked) => {
            form.setValue("shipping", checked);
            if (both) {
              form.setValue("both", false);
            }
          }}
        />
        <DeliveryOption
          form={form}
          name="both"
          label="Both Options Available"
          description="Offer both pickup and shipping options to buyers"
          checked={both}
          onCheckedChange={(checked) => {
            form.setValue("both", checked);
            if (checked) {
              form.setValue("pickup", false);
              form.setValue("shipping", false);
            }
          }}
        />
      </div>
      <DeliveryValidation showError={!pickup && !shipping && !both} />
    </div>
  );
}