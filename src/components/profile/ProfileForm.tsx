import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EmailField } from "./form/EmailField";
import { PhoneField } from "./form/PhoneField";
import { CountryField } from "./form/CountryField";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  country: z.string().min(1, "Please select a country"),
});

interface ProfileFormProps {
  defaultValues: {
    email: string;
    phone: string;
    country: string;
  };
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
}

export function ProfileForm({ defaultValues, isLoading, onSubmit }: ProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EmailField form={form} />
        <PhoneField form={form} />
        <CountryField form={form} />

        <Button type="submit" disabled={isLoading} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </form>
    </Form>
  );
}