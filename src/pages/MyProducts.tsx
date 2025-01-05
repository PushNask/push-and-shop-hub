import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from "@/components/seller/ProductGrid";
import { EmptyState } from "@/components/product/EmptyState";
import type { Product } from "@/types/product";

const MyProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles:seller_id (
            email,
            country,
            phone,
            name
          )
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    }
  });

  const { mutate: relistProduct } = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .update({ 
          status: 'pending',
          expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        })
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      toast.success("Product submitted for approval!");
    },
    onError: () => {
      toast.error("Failed to relist product");
    }
  });

  const { mutate: removeProduct } = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      toast.success("Product removed successfully!");
    },
    onError: () => {
      toast.error("Failed to remove product");
    }
  });

  const handleRelist = async (productId: string) => {
    setIsLoading(true);
    try {
      await relistProduct(productId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    setIsLoading(true);
    try {
      await removeProduct(productId);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProducts) {
    return (
      <div className="container py-6 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>My Products</CardTitle>
          <span className="text-sm text-muted-foreground">
            {products.length} total products
          </span>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="approved">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>

            {["all", "approved", "pending", "expired"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                {products.filter(product => tab === "all" || product.status === tab).length === 0 ? (
                  <EmptyState />
                ) : (
                  <ProductGrid
                    products={products.filter(product => tab === "all" || product.status === tab)}
                    isLoading={isLoading}
                    onRelist={handleRelist}
                    onRemove={handleRemove}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProducts;