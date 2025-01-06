import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function PermanentLinkSlot() {
  const { slot } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!slot) {
          navigate("/");
          return;
        }

        const slotNumber = parseInt(slot.replace("P", ""));
        if (isNaN(slotNumber) || slotNumber < 1 || slotNumber > 120) {
          toast.error("Invalid link slot");
          navigate("/");
          return;
        }

        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            profiles:seller_id (
              email,
              country,
              phone
            )
          `)
          .eq("link_slot", slotNumber)
          .eq("status", "approved")
          .single();

        if (error) {
          console.error("Error fetching product:", error);
          toast.error("Failed to load product");
          return;
        }

        if (!data) {
          toast.error("No product found in this slot");
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slot, navigate]);

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">No Product Found</h1>
          <p className="text-muted-foreground">
            This permanent link slot is currently available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <ProductCard 
        title={product.title}
        price={product.price}
        images={product.images}
        category={product.category}
        id={product.id}
        seller={product.profiles}
      />
    </div>
  );
}