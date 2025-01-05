import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAddProduct } from "@/hooks/seller/useAddProduct";
import { ProductDetailsSection } from "@/components/forms/ProductDetailsSection";
import { CategorySection } from "@/components/forms/CategorySection";
import { ImageUploadSection } from "@/components/forms/ImageUploadSection";
import { DeliveryOptionsSection } from "@/components/forms/DeliveryOptionsSection";
import { ListingFeeSection } from "@/components/forms/ListingFeeSection";
import { PaymentMethodSection } from "@/components/forms/PaymentMethodSection";
import { useState } from "react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid number greater than 0",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  images: z.array(z.custom<File>())
    .min(1, "At least one image is required")
    .max(7, "Maximum 7 images allowed")
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      "Each file must be less than 5MB"
    )
    .refine(
      (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
  pickup: z.boolean().optional(),
  shipping: z.boolean().optional(),
  both: z.boolean().optional(),
  paymentMethod: z.enum(["cash", "online"]),
  listingType: z.enum(["standard", "featured"]),
  duration: z.string(),
}).refine((data) => data.pickup || data.shipping || data.both, {
  message: "Select at least one delivery option",
  path: ["delivery"],
});

export type AddProductFormValues = z.infer<typeof formSchema>;

export function AddProductForm() {
  const { mutate: addProduct, isPending } = useAddProduct();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      images: [],
      pickup: false,
      shipping: false,
      both: false,
      paymentMethod: "cash",
      listingType: "standard",
      duration: "24",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = imageFiles.length + files.length;

    if (totalImages > 7) {
      toast.error("Maximum 7 images allowed");
      return;
    }

    // Validate file size and type
    const invalidFiles = files.filter(
      file => file.size > MAX_FILE_SIZE || !ACCEPTED_IMAGE_TYPES.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error(`Some files were rejected. Please ensure all files are images under ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    // Create URLs for preview
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    
    setImageUrls(prev => [...prev, ...newImageUrls]);
    setImageFiles(prev => [...prev, ...files]);
    form.setValue('images', [...imageFiles, ...files]);
  };

  const handleImageRemove = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    form.setValue('images', imageFiles.filter((_, i) => i !== index));
  };

  const onSubmit = (data: AddProductFormValues) => {
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    addProduct({ ...data, images: imageFiles });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProductDetailsSection form={form} />
        <CategorySection form={form} />
        <ImageUploadSection 
          form={form}
          imageUrls={imageUrls}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
          maxSize={MAX_FILE_SIZE}
          acceptedTypes={ACCEPTED_IMAGE_TYPES}
        />
        <DeliveryOptionsSection form={form} />
        <ListingFeeSection form={form} />
        <PaymentMethodSection form={form} />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
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
  );
}