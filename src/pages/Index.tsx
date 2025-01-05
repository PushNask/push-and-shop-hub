import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { transformProduct } from "@/types/product";

export default function Index() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: products, isLoading, error } = useProducts(currentPage);

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
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
          </div>
        ) : (
          <ProductCarousel 
            products={products?.featured.map(transformProduct) || []} 
          />
        )}
      </section>

      {/* Standard Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products?.standard.map(transformProduct).map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.images?.[0] || "/placeholder.svg"}
                />
              ))}
            </div>
            
            {products?.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  className="justify-center"
                  count={products.totalPages}
                  page={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}