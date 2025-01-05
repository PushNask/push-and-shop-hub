import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Grid2X2, List } from "lucide-react";
import { Product } from "@/types/product";
import { Pagination } from "./ui/pagination";
import { SkeletonCard } from "./SkeletonCard";
import { cn } from "@/lib/utils";

interface ProductDisplayProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductDisplay({ products, isLoading }: ProductDisplayProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'popularity'>('date');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });

  const productsPerPage = 12;

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      (!selectedCategory || product.category === selectedCategory) &&
      (product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (product.price >= priceRange.min && product.price <= priceRange.max)
    )
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'date') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      // For popularity, we could use views or another metric
      return 0;
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto"
          />
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Fashion">Fashion</SelectItem>
              <SelectItem value="Home">Home & Garden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={cn(
        "grid gap-4",
        viewMode === 'grid' 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      )}>
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            price={product.price}
            images={product.images}
            seller={product.seller}
            expiry={product.expiry}
            deliveryOptions={{
              pickup: product.pickup || false,
              shipping: product.shipping || false,
              both: product.both || false
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
    </div>
  );
}