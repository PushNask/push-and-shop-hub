import { format } from "date-fns";
import type { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{product.title}</h3>
      <p className="text-sm text-muted-foreground">{product.description}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Price</p>
          <p className="text-sm text-muted-foreground">
            {product.price} {product.currency}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Category</p>
          <p className="text-sm text-muted-foreground">{product.category}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Created</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(product.created_at || new Date()), "PPP")}
          </p>
        </div>
        {product.expiry && (
          <div>
            <p className="text-sm font-medium">Expires</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(product.expiry), "PPP")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}