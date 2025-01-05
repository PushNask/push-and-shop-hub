import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImages } from "@/components/product/ProductImages";
import { ProductInfo } from "@/components/product/ProductInfo";
import { SellerInfo } from "@/components/product/SellerInfo";
import { ShareSection } from "@/components/product/ShareSection";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
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
          .single();

        if (error) throw error;
        if (!data) {
          toast.error("Product not found");
          navigate('/');
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!product?.expiry) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(product.expiry).getTime();
      const distance = expiryTime - now;
      
      if (distance < 0) {
        setTimeLeft("EXPIRED");
        return null;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${days}d ${hours}h ${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft() || "EXPIRED");
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (remaining === null) {
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [product?.expiry]);

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

  const shareUrl = window.location.href;

  return (
    <div className="container py-6 space-y-6 animate-fadeIn">
      <ProductImages images={product.images} title={product.title} />
      <ProductInfo product={product} timeLeft={timeLeft} />
      <SellerInfo product={product} />
      <ShareSection product={product} shareUrl={shareUrl} />
    </div>
  );
};

export default ProductPage;