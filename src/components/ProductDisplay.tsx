import { useEffect } from "react";
import { Product } from "@/types/product";
import { Pagination } from "./ui/pagination";
import { SkeletonCard } from "./SkeletonCard";
import { ProductFilters } from "./product/ProductFilters";
import { ProductList } from "./product/ProductList";
import { EmptyState } from "./product/EmptyState";
import { useProductFilter, useProductSort } from "./product/ProductFilterLogic";
import { useProductParams } from "@/hooks/useProductParams";
import { cn } from "@/lib/utils";

interface ProductDisplayProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductDisplay({ products, isLoading }: ProductDisplayProps) {
  const [params, updateParams] = useProductParams();
  const productsPerPage = 12;

  // Apply filters and sorting
  const filteredProducts = useProductFilter(products, {
    selectedCategory: params.selectedCategory,
    searchQuery: params.searchQuery,
    priceRange: params.priceRange
  });
  const sortedProducts = useProductSort(filteredProducts, params.sortBy);

  // Paginate products
  const paginatedProducts = sortedProducts.slice(
    (params.currentPage - 1) * productsPerPage,
    params.currentPage * productsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    updateParams({ currentPage: 1 });
  }, [params.sortBy, params.selectedCategory, params.searchQuery, params.priceRange]);

  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-4",
        params.viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {Array.from({ length: productsPerPage }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductFilters
        viewMode={params.viewMode}
        setViewMode={(mode) => updateParams({ viewMode: mode })}
        searchQuery={params.searchQuery}
        setSearchQuery={(query) => updateParams({ searchQuery: query })}
        sortBy={params.sortBy}
        setSortBy={(sort) => updateParams({ sortBy: sort })}
        selectedCategory={params.selectedCategory}
        setSelectedCategory={(category) => updateParams({ selectedCategory: category })}
        priceRange={params.priceRange}
        setPriceRange={(range) => updateParams({ priceRange: range })}
      />

      {filteredProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ProductList products={paginatedProducts} viewMode={params.viewMode} />

          {filteredProducts.length > productsPerPage && (
            <Pagination
              className="justify-center"
              count={Math.ceil(filteredProducts.length / productsPerPage)}
              page={params.currentPage}
              onPageChange={(page) => updateParams({ currentPage: page })}
            />
          )}
        </>
      )}
    </div>
  );
}