import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImages } from "@/components/product/ProductImages";
import { ProductInfo } from "@/components/product/ProductInfo";
import { SellerInfo } from "@/components/product/SellerInfo";
import { ShareButtons } from "@/components/product/ShareButtons";
import { DeliveryBadges } from "@/components/product/DeliveryBadges";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useTimeLeft } from "@/hooks/useTimeLeft";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const timeLeft = useTimeLeft(product?.expiry);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          toast.error("Product ID is required");
          navigate('/');
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            profiles (
              email,
              country,
              phone
            )
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching product:', error);
          toast.error("Failed to load product");
          return;
        }

        if (!data) {
          toast.error("Product not found");
          navigate('/');
          return;
        }

        setProduct(data as Product);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleWhatsAppClick = () => {
    if (!product?.profiles?.phone) {
      toast.error("Seller contact information not available");
      return;
    }
    const message = `Hi, I'm interested in your product: ${product.title}. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/${product.profiles.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="aspect-square w-full bg-gray-100 rounded-lg">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container py-6 space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ProductImages images={product.images} title={product.title} />
        </div>
        <div className="space-y-6">
          <ProductInfo product={product} timeLeft={timeLeft || ''} />
          
          <div className="flex flex-col gap-4">
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleWhatsAppClick}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Seller
            </Button>
            
            <div className="bg-accent/50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Share this product</h3>
              <ShareButtons title={product.title} seller={product.profiles} />
            </div>
          </div>

          <DeliveryBadges delivery_option={product.delivery_option} />
          
          <SellerInfo product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;