import { toast } from "sonner";

export const openWhatsAppChat = (phone?: string, title?: string) => {
  if (!phone) {
    toast.error("Seller contact information not available");
    return;
  }

  // Basic phone number validation
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 8) {
    toast.error("Invalid phone number");
    return;
  }

  const message = `Hi, I'm interested in your product: ${title}. Can you provide more details?`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
  toast.success("Opening WhatsApp...");
};