import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Facebook, Twitter, Share2, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { toast } from "sonner";

// Mock product data - replace with actual data fetching
const MOCK_PRODUCT = {
  id: "p1",
  title: "Premium Smartphone",
  description: "Latest model with advanced features and exceptional camera quality.",
  price: 750000,
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  category: "Electronics",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  seller: {
    name: "Tech Store",
    rating: 4.5,
    location: "Douala, Cameroon"
  }
};

const ProductPage = () => {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState("");
  const [product, setProduct] = useState(MOCK_PRODUCT);

  // Calculate time left until expiry
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(product.expiresAt).getTime() - now;
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("EXPIRED");
      } else {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [product.expiresAt]);

  // Share functionality
  const shareUrl = window.location.href;
  const shareText = `Check out ${product.title} on PushNshop!`;

  const shareHandlers = {
    message: () => {
      window.open(`sms:?body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
      toast.success("Opening messaging app...");
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
            {product.images.map((image, index) => (
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{timeLeft}</span>
          </div>
        </div>

        <p className="text-2xl font-bold">XAF {product.price.toLocaleString()}</p>
        
        <p className="text-muted-foreground">{product.description}</p>

        {/* Seller Info */}
        <div className="p-4 rounded-lg bg-accent/50">
          <h3 className="font-medium mb-2">Seller Information</h3>
          <div className="space-y-1 text-sm">
            <p>{product.seller.name}</p>
            <p>{product.seller.location}</p>
            <p>Rating: {product.seller.rating}/5</p>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={shareHandlers.message}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
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