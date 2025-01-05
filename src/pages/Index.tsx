import { useProducts } from "@/hooks/useProducts";
import { ProductDisplay } from "@/components/ProductDisplay";
import { ProductCarousel } from "@/components/ProductCarousel";

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
      {/* Featured Products Section */}
      {products?.featured && products.featured.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          <ProductCarousel products={products.featured} />
        </section>
      )}

      {/* Standard Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        <ProductDisplay 
          products={products?.standard || []} 
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}