import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AddProductFormValues } from "@/types/product";

type AddProductInput = AddProductFormValues & {
  seller_id: string;
  currency: string;
  status: string;
};

async function uploadImages(images: string[]) {
  const uploadPromises = images.map(async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileExt = blob.type.split('/')[1];
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('product-images')
      .upload(fileName, blob);

    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  });

  return Promise.all(uploadPromises);
}

async function addProduct(data: AddProductInput) {
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
      seller_id: data.seller_id,
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      images: imageUrls,
      status: data.status,
      expiry: expiryDate.toISOString(),
    })
    .select()
    .single();

  if (productError) throw productError;

  // Create transaction for listing fee
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      seller_id: data.seller_id,
      product_id: productData.id,
      amount: listingFee,
      currency: data.currency,
      payment_method: 'cash',
      status: 'pending'
    });

  if (transactionError) throw transactionError;

  return productData;
}

export function useAddProduct() {
  return useMutation({
    mutationFn: addProduct,
  });
}