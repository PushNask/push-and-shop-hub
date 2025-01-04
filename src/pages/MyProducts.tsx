import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

// Mock data - replace with actual data fetching
const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Premium Smartphone",
    price: 750000,
    image: "/placeholder.svg",
    status: "active",
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  },
  {
    id: "2",
    title: "Laptop",
    price: 450000,
    image: "/placeholder.svg",
    status: "expired",
    expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "3",
    title: "Wireless Earbuds",
    price: 25000,
    image: "/placeholder.svg",
    status: "pending",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
];

const MyProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const handleRelist = async (productId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update product status
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId
            ? { ...product, status: "active", expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
            : product
        )
      );
      
      toast.success("Product relisted successfully!");
    } catch (error) {
      toast.error("Failed to relist product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove product from list
      setProducts(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      );
      
      toast.success("Product removed successfully!");
    } catch (error) {
      toast.error("Failed to remove product");
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
                          title={product.title}
                          price={product.price}
                          image={product.image}
                        />
                        <div className="absolute top-2 right-2">
                          {getStatusBadge(product.status)}
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