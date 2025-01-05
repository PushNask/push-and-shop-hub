import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ProductDetailsSection } from "@/components/forms/ProductDetailsSection";
import { ImageUploadSection } from "@/components/forms/ImageUploadSection";
import { CategorySection } from "@/components/forms/CategorySection";
import { DeliveryOptionsSection } from "@/components/forms/DeliveryOptionsSection";
import { ListingFeeSection } from "@/components/forms/ListingFeeSection";
import { useAddProduct } from "@/hooks/seller/useAddProduct";
import { useSession } from "@supabase/auth-helpers-react";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Please select a category"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  pickup: z.boolean().optional(),
  shipping: z.boolean().optional(),
  both: z.boolean().optional(),
  listingType: z.enum(["standard", "featured"]),
  duration: z.string()
});

export function AddProductForm() {
  const navigate = useNavigate();
  const session = useSession();
  const { mutate: addProduct, isLoading } = useAddProduct();

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      images: [],
      pickup: false,
      shipping: false,
      both: false,
      listingType: "standard",
      duration: "24"
    }
  });

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to add a product");
      return;
    }

    if (!data.pickup && !data.shipping && !data.both) {
      toast.error("Please select at least one delivery option");
      return;
    }

    try {
      await addProduct({
        ...data,
        seller_id: session.user.id,
        currency: "XAF",
        status: "pending"
      });

      toast.success("Product submitted for approval!");
      navigate("/seller/products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProductDetailsSection form={form} />
        <ImageUploadSection form={form} />
        <CategorySection form={form} />
        <DeliveryOptionsSection form={form} />
        <ListingFeeSection form={form} />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}