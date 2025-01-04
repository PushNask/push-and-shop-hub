import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImageUploadSection } from "@/components/forms/ImageUploadSection";
import { DeliveryOptionsSection } from "@/components/forms/DeliveryOptionsSection";
import { ListingFeeSection } from "@/components/forms/ListingFeeSection";
import { PaymentMethodSection } from "@/components/forms/PaymentMethodSection";
import { ProductDetailsSection } from "@/components/forms/ProductDetailsSection";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid number greater than 0",
  }),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required").max(7, "Maximum 7 images allowed"),
  listingType: z.enum(["standard", "featured"], {
    required_error: "Please select a listing type",
  }),
  duration: z.enum(["24", "48", "72", "96", "120"], {
    required_error: "Please select a duration",
  }),
  paymentMethod: z.enum(["cash", "online"], {
    required_error: "Please select a payment method",
  }),
  pickup: z.boolean().optional(),
  shipping: z.boolean().optional(),
}).refine((data) => data.pickup || data.shipping, {
  message: "Select at least one delivery option",
  path: ["delivery"],
});

type FormValues = z.infer<typeof formSchema>;

export default function AddNewProduct() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      images: [],
      listingType: "standard",
      duration: "24",
      paymentMethod: "cash",
      pickup: true,
      shipping: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 7) {
      toast.error("Maximum 7 images allowed");
      return;
    }

    const urls = files.map(file => URL.createObjectURL(file));
    setImageUrls(prev => [...prev, ...urls]);
    
    const currentImages = form.getValues("images");
    form.setValue("images", [...currentImages, ...files]);
  };

  const onSubmit = async (data: FormValues) => {
    if (!data.pickup && !data.shipping) {
      toast.error("Please select at least one delivery option");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Form data:", data);
      toast.success("Product added successfully!");
      navigate("/seller/products");
    } catch (error) {
      toast.error("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-6 space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground">
          Fill in the details below to list your product on PushNshop.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ProductDetailsSection form={form} />
          
          <ImageUploadSection 
            form={form}
            imageUrls={imageUrls}
            onImageChange={handleImageChange}
          />

          <ListingFeeSection form={form} />
          
          <PaymentMethodSection form={form} />

          <DeliveryOptionsSection form={form} />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}