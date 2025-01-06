import { Shield } from "lucide-react";

interface ProductStatusProps {
  status: 'pending' | 'approved' | 'rejected';
}

export const ProductStatus = ({ status }: ProductStatusProps) => {
  if (status !== 'approved') return null;

  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <Shield className="h-4 w-4" aria-hidden="true" />
      <span>Verified Listing</span>
    </div>
  );
};