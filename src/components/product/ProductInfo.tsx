import { Clock } from "lucide-react";
import { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
  timeLeft: string;
}

export const ProductInfo = ({ product, timeLeft }: ProductInfoProps) => {
  return (
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
    </div>
  );
};