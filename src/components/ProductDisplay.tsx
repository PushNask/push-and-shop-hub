import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { Pagination } from "./ui/pagination";
import { SkeletonCard } from "./SkeletonCard";
import { ProductFilters } from "./product/ProductFilters";
import { useToast } from "@/hooks/use-toast";

interface ProductDisplayProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductDisplay({ products, isLoading }: ProductDisplayProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'popularity'>('date');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });

  const productsPerPage = 12;

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      try {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const price = Number(product.price);
        const matchesPrice = !isNaN(price) && price >= priceRange.min && price <= priceRange.max;
        
        return matchesCategory && matchesSearch && matchesPrice;
      } catch (error) {
        console.error('Error filtering product:', error);
        toast({
          title: "Error",
          description: "There was a problem filtering the products",
          variant: "destructive",
        });
        return false;
      }
    })
    .sort((a, b) => {
      try {
        if (sortBy === 'price') return Number(a.price) - Number(b.price);
        if (sortBy === 'date') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        return 0;
      } catch (error) {
        console.error('Error sorting products:', error);
        return 0;
      }
    });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

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
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No products found matching your criteria</p>
        </div>
      ) : (
        <>
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
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
                className={viewMode === 'list' ? "flex flex-row" : ""}
              />
            ))}
          </div>

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