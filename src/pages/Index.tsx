import { useProducts } from "@/hooks/useProducts";
import { ProductDisplay } from "@/components/ProductDisplay";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Index() {
  const { data: products, isLoading, error } = useProducts();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Failed to load products</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <ErrorBoundary>
        <FeaturedProducts />
      </ErrorBoundary>

      <section>
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        <ErrorBoundary>
          <ProductDisplay 
            products={products?.standard || []} 
            isLoading={isLoading}
          />
        </ErrorBoundary>
      </section>
    </div>
  );
}