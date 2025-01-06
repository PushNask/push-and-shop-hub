import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function LinkSlotRedirect() {
  const { slot } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductFromSlot = async () => {
      try {
        // Remove the 'P' prefix and convert to number
        const slotNumber = parseInt(slot?.replace('P', '') || '0', 10);
        
        if (isNaN(slotNumber) || slotNumber < 1 || slotNumber > 120) {
          toast.error("Invalid link slot");
          navigate('/');
          return;
        }

        const { data: product, error } = await supabase
          .from('products')
          .select('id')
          .eq('link_slot', slotNumber)
          .eq('status', 'approved')
          .single();

        if (error || !product) {
          toast.error("No product found in this slot");
          navigate('/');
          return;
        }

        // Redirect to the product page
        navigate(`/products/${product.id}`);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error("Failed to load product");
        navigate('/');
      }
    };

    fetchProductFromSlot();
  }, [slot, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">
        <p className="text-lg text-muted-foreground">Loading product...</p>
      </div>
    </div>
  );
}