import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Facebook, Twitter, Share2, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";

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

  // Calculate time left until expiry
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

  // Share functionality
  const shareUrl = window.location.href;
  const shareText = `Check out ${product.title} on PushNshop!`;

  const shareHandlers = {
    message: () => {
      if (product.profiles?.phone) {
        const message = encodeURIComponent(`Hi, I'm interested in your product: ${product.title}`);
        window.open(`https://wa.me/${product.profiles.phone}?text=${message}`, '_blank');
        toast.success("Opening WhatsApp...");
      } else {
        toast.error("Seller's contact information is not available");
      }
    },
    facebook: () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      toast.success("Opening Facebook...");
    },
    twitter: () => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      toast.success("Opening Twitter...");
    },
    copyLink: async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <div className="container py-6 space-y-6 animate-fadeIn">
      {/* Product Images Carousel */}
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        <Carousel className="w-full">
          <CarouselContent>
            {product.images?.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square relative">
                  <img
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          {timeLeft && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{timeLeft}</span>
            </div>
          )}
        </div>

        <p className="text-2xl font-bold">XAF {product.price.toLocaleString()}</p>
        
        <p className="text-muted-foreground">{product.description}</p>

        {/* Seller Info */}
        {product.profiles && (
          <div className="p-4 rounded-lg bg-accent/50">
            <h3 className="font-medium mb-2">Seller Information</h3>
            <div className="space-y-1 text-sm">
              <p>{product.profiles.email}</p>
              <p>{product.profiles.country}</p>
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={shareHandlers.message}>
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
          <Button variant="outline" onClick={shareHandlers.facebook}>
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>
          <Button variant="outline" onClick={shareHandlers.twitter}>
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </Button>
          <Button variant="outline" onClick={shareHandlers.copyLink}>
            <Share2 className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;