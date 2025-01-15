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
import { useState } from "react";
import type { AddProductFormValues } from "@/types/product";
import { ProductPreview } from "./ProductPreview";
import { ImageUploadLoading } from "./ImageUploadLoading";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { sanitizeFileName } from "@/utils/file-utils";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().transform((val) => Number(val)),
  category: z.string().min(1, "Please select a category"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  delivery_option: z.enum(["pickup", "shipping", "both"]),
  listingType: z.enum(["standard", "featured"]),
  duration: z.string()
});

export function AddProductForm() {
  const navigate = useNavigate();
  const session = useSession();
  const { mutateAsync: addProduct, isPending } = useAddProduct();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      images: [],
      delivery_option: 'pickup',
      listingType: "standard",
      duration: "24"
    }
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setIsUploading(true);
    
    try {
      const urls = [...imageUrls];
      
      for (const file of files) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds 2MB limit`);
          continue;
        }

        const sanitizedName = sanitizeFileName(file.name);
        const fileName = `${crypto.randomUUID()}-${sanitizedName}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) {
          console.error('Upload error:', error);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        urls.push(publicUrl);
      }
      
      setImageUrls(urls);
      form.setValue("images", urls);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageRemove = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    form.setValue("images", newUrls);
  };

  const onSubmit = async (data: AddProductFormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to add a product");
      return;
    }

    try {
      await addProduct({
        ...data,
        price: Number(data.price),
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

  if (authError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{authError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/seller/products">
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>Add New Product</BreadcrumbItem>
        </Breadcrumb>
        <Button
          variant="ghost"
          onClick={() => navigate("/seller/products")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <ProductDetailsSection form={form} />
              <div className="relative">
                <ImageUploadSection 
                  form={form}
                  imageUrls={imageUrls}
                  onImageChange={handleImageChange}
                  onImageRemove={handleImageRemove}
                />
                {isUploading && <ImageUploadLoading />}
              </div>
              <CategorySection form={form} />
              <DeliveryOptionsSection form={form} />
              <ListingFeeSection form={form} />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isPending || isUploading || !!authError}
              >
                {isPending ? "Creating..." : "Create Ad"}
              </Button>
            </div>

            <div className="lg:sticky lg:top-4">
              <ProductPreview 
                formData={form.watch()} 
                imageUrls={imageUrls}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}