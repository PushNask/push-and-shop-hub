import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openWhatsAppChat } from "@/utils/contact";

interface ProductContactButtonProps {
  phone?: string;
  title: string;
}

export const ProductContactButton = ({ phone, title }: ProductContactButtonProps) => {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openWhatsAppChat(phone, title);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-background/0 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
      <Button
        variant="outline"
        size="sm"
        className="w-full bg-background/50 backdrop-blur-sm"
        onClick={handleWhatsAppClick}
        aria-label={`Contact seller about ${title}`}
      >
        <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
        Contact Seller
      </Button>
    </div>
  );
};