import { FormField, FormItem, FormControl, FormMessage, FormLabel, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DeliveryOptionsSectionProps {
  form: any;
}

export function DeliveryOptionsSection({ form }: DeliveryOptionsSectionProps) {
  const pickup = form.watch("pickup");
  const shipping = form.watch("shipping");

  return (
    <div className="space-y-3">
      <FormLabel>Delivery Options</FormLabel>
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="pickup"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Pickup Available
                </FormLabel>
                <FormDescription>
                  Buyers can pick up the product from your location
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shipping"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Shipping Available
                </FormLabel>
                <FormDescription>
                  You can ship the product to buyers
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
      {!pickup && !shipping && (
        <Alert variant="destructive">
          <AlertDescription>
            Please select at least one delivery option
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}