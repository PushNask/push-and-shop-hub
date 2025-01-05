import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { Pagination } from "./ui/pagination";
import { SkeletonCard } from "./SkeletonCard";
import { ProductFilters } from "./product/ProductFilters";
import { ProductList } from "./product/ProductList";
import { EmptyState } from "./product/EmptyState";
import { useProductFilter, useProductSort } from "./product/ProductFilterLogic";
import { useUrlParams } from "@/hooks/useUrlParams";
import { cn } from "@/lib/utils";

interface ProductDisplayProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductDisplay({ products, isLoading }: ProductDisplayProps) {
  const { updateParams, getParam } = useUrlParams();

  // Initialize state from URL parameters
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    (getParam('view') as 'grid' | 'list') || 'grid'
  );
  const [currentPage, setCurrentPage] = useState(Number(getParam('page')) || 1);
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'popularity'>(
    (getParam('sort') as 'price' | 'date' | 'popularity') || 'date'
  );
  const [selectedCategory, setSelectedCategory] = useState(getParam('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(getParam('search') || '');
  const [priceRange, setPriceRange] = useState({
    min: Number(getParam('minPrice')) || 0,
    max: Number(getParam('maxPrice')) || Infinity
  });

  // Update URL when filters change
  useEffect(() => {
    updateParams({
      view: viewMode,
      page: currentPage.toString(),
      sort: sortBy,
      category: selectedCategory,
      search: searchQuery,
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max === Infinity ? '' : priceRange.max.toString()
    });
  }, [viewMode, currentPage, sortBy, selectedCategory, searchQuery, priceRange]);

  const productsPerPage = 12;

  // Apply filters and sorting
  const filteredProducts = useProductFilter(products, {
    selectedCategory,
    searchQuery,
    priceRange
  });
  const sortedProducts = useProductSort(filteredProducts, sortBy);

  // Paginate products
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, selectedCategory, searchQuery, priceRange]);

  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-4",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
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
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {filteredProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ProductList products={paginatedProducts} viewMode={viewMode} />

          {filteredProducts.length > productsPerPage && (
            <Pagination
              className="justify-center"
              count={Math.ceil(filteredProducts.length / productsPerPage)}
              page={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}