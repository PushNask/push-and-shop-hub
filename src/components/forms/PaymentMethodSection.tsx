import { FormField, FormItem, FormControl, FormDescription, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentMethodSectionProps {
  form: any;
}

export function PaymentMethodSection({ form }: PaymentMethodSectionProps) {
  return (
    <FormField
      control={form.control}
      name="paymentMethod"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Payment Method</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="cash" />
                </FormControl>
                <FormLabel className="font-normal">
                  Cash Payment (via authorized partners)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="online" />
                </FormControl>
                <FormLabel className="font-normal">
                  Online Payment
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormDescription>
            Choose your preferred payment method
          </FormDescription>
        </FormItem>
      )}
    />
  );
}