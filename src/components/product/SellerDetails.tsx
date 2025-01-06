import { MapPin, Shield } from "lucide-react";

interface SellerDetailsProps {
  seller?: {
    country?: string;
  };
  status?: string;
}

export function SellerDetails({ seller, status }: SellerDetailsProps) {
  return (
    <div className="space-y-2">
      {seller?.country && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{seller.country}</span>
        </div>
      )}
      
      {status === 'approved' && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Shield className="h-4 w-4 shrink-0" />
          <span>Verified Listing</span>
        </div>
      )}
    </div>
  );
}