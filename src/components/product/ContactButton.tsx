import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ContactButtonProps {
  seller?: {
    phone?: string;
  };
  title: string;
}

export function ContactButton({ seller, title }: ContactButtonProps) {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!seller?.phone) {
      toast.error("Seller contact information not available");
      return;
    }
    const message = `Hi, I'm interested in your product: ${title}. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/${seller.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full bg-background/50 backdrop-blur-sm"
      onClick={handleWhatsAppClick}
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      Contact Seller
    </Button>
  );
}