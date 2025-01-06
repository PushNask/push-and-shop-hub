import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function PermanentLinkSlot() {
  const { slot } = useParams();
  const navigate = useNavigate();
  const slotNumber = parseInt(slot?.replace("P", "") || "0");

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["permanent-link", slotNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          profiles (
            email,
            country,
            phone
          )
        `)
        .eq("link_slot", slotNumber)
        .eq("status", "approved")
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slotNumber && slotNumber > 0 && slotNumber <= 120,
  });

  if (!slotNumber || slotNumber < 1 || slotNumber > 120) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Link Slot</h1>
        <p className="text-muted-foreground mb-4">
          This permanent link slot does not exist. Valid slots are P1 through P120.
        </p>
        <Button onClick={() => navigate("/")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-[400px] bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Product</h1>
        <p className="text-muted-foreground mb-4">
          Failed to load the product for this permanent link slot.
        </p>
        <Button onClick={() => navigate("/")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Link Slot P{slotNumber}</h1>
        <p className="text-muted-foreground mb-4">
          This permanent link slot is currently available.
        </p>
        <Button onClick={() => navigate("/")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Permanent Link Slot P{slotNumber}</h1>
        <p className="text-muted-foreground">
          {slotNumber <= 12 ? "Featured slot with premium visibility" : "Standard link slot"}
        </p>
      </div>
      <ProductCard product={product} />
    </div>
  );
}