import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { AddProductFormValues } from "@/components/seller/products/AddProductForm";

async function uploadImages(images: File[]) {
  const uploadPromises = images.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  });

  return Promise.all(uploadPromises);
}

async function addProduct(data: AddProductFormValues) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Upload images first
  const imageUrls = await uploadImages(data.images);

  // Calculate expiry date
  const durationHours = parseInt(data.duration);
  const expiryDate = new Date(Date.now() + durationHours * 60 * 60 * 1000);

  // Calculate listing fee
  const feeStructure = {
    standard: { '24': 10, '48': 17, '72': 25, '96': 30, '120': 40 },
    featured: { '24': 25, '48': 40, '72': 60, '96': 80, '120': 100 },
  } as const;

  const listingFee = feeStructure[data.listingType][data.duration as keyof (typeof feeStructure)['standard']];

  // Insert product
  const { error: productError, data: productData } = await supabase
    .from('products')
    .insert({
      seller_id: user.id,
      title: data.title,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      images: imageUrls,
      status: 'pending',
      expiry: expiryDate.toISOString(),
    })
    .select()
    .single();

  if (productError) throw productError;

  // Create transaction for listing fee
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      seller_id: user.id,
      product_id: productData.id,
      amount: listingFee,
      payment_method: data.paymentMethod,
      status: 'pending'
    });

  if (transactionError) throw transactionError;

  return productData;
}

export function useAddProduct() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      toast.success("Product submitted for approval!");
      navigate("/seller/products");
    },
    onError: (error) => {
      console.error('Error adding product:', error);
      toast.error("Failed to add product. Please try again.");
    },
  });
}