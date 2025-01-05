import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { ProductActions } from "./ProductActions";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onRelist: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export const ProductGrid = ({ products, isLoading, onRelist, onRemove }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No products found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="relative">
          <ProductCard
            id={product.id}
            title={product.title}
            price={product.price}
            images={product.images}
            seller={product.seller}
            expiry={product.expiry}
            deliveryOptions={{
              pickup: product.pickup ?? false,
              shipping: product.shipping ?? false,
              both: product.both ?? false
            }}
            category={product.category}
          />
          <div className="absolute top-2 right-2">
            <ProductStatusBadge status={product.status || 'pending'} />
          </div>
          <ProductActions
            status={product.status || 'pending'}
            isLoading={isLoading}
            onRelist={() => onRelist(product.id)}
            onRemove={() => onRemove(product.id)}
          />
        </div>
      ))}
    </div>
  );
};