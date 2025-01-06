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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="relative group">
          <ProductCard
            id={product.id}
            title={product.title}
            price={product.price}
            images={product.images}
            seller={product.profiles}
            expiry={product.expiry}
            delivery_option={product.delivery_option}
            category={product.category}
            status={product.status as 'pending' | 'approved' | 'rejected'}
            className="transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <div className="absolute top-2 right-2">
            <ProductStatusBadge status={product.status || 'pending'} />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ProductActions
              status={product.status || 'pending'}
              isLoading={isLoading}
              onRelist={() => onRelist(product.id)}
              onRemove={() => onRemove(product.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};