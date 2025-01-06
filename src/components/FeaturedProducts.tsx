import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { ProductCarousel } from "./ProductCarousel";
import { Skeleton } from "./ui/skeleton";
import { ErrorBoundary } from "./ErrorBoundary";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function FeaturedProducts() {
  const { data: featuredProducts, isLoading, error } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          profiles (
            email,
            country,
            phone,
            name
          )
        `)
        .eq("status", "approved")
        .lte("link_slot", 12)
        .order("link_slot", { ascending: true });

      if (error) throw error;
      return data as Product[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load featured products. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!featuredProducts?.length) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Featured Products</AlertTitle>
        <AlertDescription>
          There are currently no featured products available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ErrorBoundary>
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
          <p className="text-muted-foreground">
            Browse our selection of premium featured products
          </p>
        </div>
        <ProductCarousel products={featuredProducts} />
      </section>
    </ErrorBoundary>
  );
}