import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export function PermanentLinkSlot() {
  const { slot } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("link_slot", slot?.replace("P", ""))
          .eq("status", "approved")
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slot) {
      fetchProduct();
    }
  }, [slot]);

  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">No Product Found</h1>
          <p className="text-muted-foreground">
            This permanent link slot is currently available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <ProductCard 
        title={product.title}
        price={product.price}
        currency={product.currency}
        image={product.images?.[0]}
        category={product.category}
        id={product.id}
      />
    </div>
  );
}