import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { ProductCarousel } from "./ProductCarousel";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";

export function FeaturedProducts() {
  const { data: featuredProducts, isLoading, error } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, profiles(email, country, phone)")
          .eq("status", "approved")
          .lte("link_slot", 12)
          .order("link_slot", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          throw new Error(error.message);
        }

        if (!data) {
          return [];
        }

        return data as Product[];
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        toast.error("Failed to load featured products");
        throw err;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        <p>Unable to load featured products.</p>
        <p className="text-sm">Please try refreshing the page.</p>
      </div>
    );
  }

  if (!featuredProducts?.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Featured Products</h2>
      <ProductCarousel products={featuredProducts} />
    </section>
  );
}