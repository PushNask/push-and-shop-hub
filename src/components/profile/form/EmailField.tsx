import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

interface EmailFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function EmailField({ form }: EmailFieldProps) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} type="email" disabled />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}