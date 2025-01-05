import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

interface PhoneFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function PhoneField({ form }: PhoneFieldProps) {
  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <PhoneInput
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}