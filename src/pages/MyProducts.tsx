import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";

const MyProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    }
  });

  // Relist product mutation
  const { mutate: relistProduct } = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .update({ 
          status: 'pending',
          expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() 
        })
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      toast.success("Product relisted successfully!");
    },
    onError: () => {
      toast.error("Failed to relist product");
    }
  });

  // Remove product mutation
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

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-500",
      expired: "bg-red-500",
      pending: "bg-yellow-500"
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoadingProducts) {
    return (
      <div className="container py-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>

            {["all", "active", "pending", "expired"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products
                    .filter(product => tab === "all" || product.status === tab)
                    .map((product) => (
                      <div key={product.id} className="relative">
                        <ProductCard
                          id={product.id}
                          title={product.title}
                          price={product.price}
                          images={product.images}
                          seller={product.seller}
                          expiry={product.expiry}
                          deliveryOptions={{
                            pickup: product.pickup ?? false,
                            shipping: product.shipping ?? false,
                            both: product.both ?? false
                          }}
                          category={product.category}
                        />
                        <div className="absolute top-2 right-2">
                          {getStatusBadge(product.status || 'pending')}
                        </div>
                        <div className="mt-2 flex gap-2 justify-end">
                          {product.status === "expired" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRelist(product.id)}
                              disabled={isLoading}
                            >
                              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Relist
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemove(product.id)}
                            disabled={isLoading}
                          >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
                {products.filter(product => tab === "all" || product.status === tab).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No products found
                  </div>
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