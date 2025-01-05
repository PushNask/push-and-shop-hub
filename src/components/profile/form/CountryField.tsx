import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  country: z.string().min(1, "Please select a country"),
});

const COUNTRIES = [
  { id: "cm", name: "Cameroon" },
  { id: "ng", name: "Nigeria" },
];

interface CountryFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function CountryField({ form }: CountryFieldProps) {
  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Country</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}