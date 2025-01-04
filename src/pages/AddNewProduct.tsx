import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  paymentMethod: z.enum(["cash", "online"], {
    required_error: "Please select a payment method",
  }),
  pickup: z.boolean().optional(),
  shipping: z.boolean().optional(),
}).refine((data) => data.pickup || data.shipping, {
  message: "Select at least one delivery option",
  path: ["delivery"], // This is used to show the error message
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

    // Create preview URLs for the images
    const urls = files.map(file => URL.createObjectURL(file));
    setImageUrls(prev => [...prev, ...urls]);
    
    // Update form value
    const currentImages = form.getValues("images");
    form.setValue("images", [...currentImages, ...files]);
  };

  const onSubmit = async (data: FormValues) => {
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
    <div className="container max-w-2xl py-6 space-y-6 fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground">
          Fill in the details below to list your product on PushNshop.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Product title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your product..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (XAF)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32 flex flex-col gap-2"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <ImagePlus className="h-8 w-8" />
                      <span>Upload Images (Max 7)</span>
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    {imageUrls.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative aspect-square">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload up to 7 images of your product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="listingType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Listing Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="standard" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Standard Listing (P13-P120)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="featured" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Featured Listing (P1-P12)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormLabel>Delivery Options</FormLabel>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="pickup"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Pickup Available
                      </FormLabel>
                      <FormDescription>
                        Buyers can pick up the product from your location
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipping"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Shipping Available
                      </FormLabel>
                      <FormDescription>
                        You can ship the product to buyers
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            {!form.getValues("pickup") && !form.getValues("shipping") && (
              <Alert variant="destructive">
                <AlertDescription>
                  Please select at least one delivery option
                </AlertDescription>
              </Alert>
            )}
          </div>

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