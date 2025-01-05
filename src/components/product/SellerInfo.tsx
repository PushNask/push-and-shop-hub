import { Product } from "@/types/product";

interface SellerInfoProps {
  product: Product;
}

export const SellerInfo = ({ product }: SellerInfoProps) => {
  if (!product.profiles) return null;

  return (
    <div className="p-4 rounded-lg bg-accent/50">
      <h3 className="font-medium mb-2">Seller Information</h3>
      <div className="space-y-1 text-sm">
        <p>{product.profiles.email}</p>
        <p>{product.profiles.country}</p>
      </div>
    </div>
  );
};