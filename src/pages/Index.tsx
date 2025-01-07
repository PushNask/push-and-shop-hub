import { useProducts } from "@/hooks/useProducts";
import { ProductDisplay } from "@/components/ProductDisplay";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Index() {
  const { data: products, isLoading, error } = useProducts();

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1">
          <p className="text-red-500">Failed to load products</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1 space-y-8">
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
      <Footer />
    </div>
  );
}