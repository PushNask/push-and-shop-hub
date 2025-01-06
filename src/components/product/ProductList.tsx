import { cn } from "@/lib/utils";
import { ProductCard } from "../ProductCard";
import { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
  viewMode: 'grid' | 'list';
}

export function ProductList({ products, viewMode }: ProductListProps) {
  return (
    <div className={cn(
      "grid gap-4",
      viewMode === 'grid' 
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
        : "grid-cols-1"
    )}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          price={product.price}
          images={product.images}
          seller={product.seller}
          expiry={product.expiry}
          delivery_option={product.delivery_option}
          category={product.category}
          className={viewMode === 'list' ? "flex flex-row" : ""}
        />
      ))}
    </div>
  );
}