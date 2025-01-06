import { FormField, FormItem, FormControl, FormLabel, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface DeliveryOptionProps {
  form: any;
  name: string;
  label: string;
  description: string;
  checked?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function DeliveryOption({ 
  form, 
  name, 
  label, 
  description, 
  checked,
  onCheckedChange 
}: DeliveryOptionProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={checked ?? field.value}
              onCheckedChange={onCheckedChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              {label}
            </FormLabel>
            <FormDescription>
              {description}
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
}