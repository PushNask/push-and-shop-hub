import { useState, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import ReactPaginate from "react-paginate";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductCarousel } from "@/components/ProductCarousel";
import { SkeletonCard } from "@/components/SkeletonCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data - replace with actual data later
const MOCK_PRODUCTS = Array.from({ length: 120 }, (_, i) => {
  const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports"];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  return {
    id: `p${i + 1}`,
    title: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 900000) + 100000,
    image: "/placeholder.svg",
    category: randomCategory,
    isFeatured: i < 12 // P1-P12 are featured
  };
});

const ITEMS_PER_PAGE = 12;

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setCurrentPage(0);
    }, 300),
    []
  );

  // Filter products
  const featuredProducts = MOCK_PRODUCTS.filter(p => p.isFeatured);
  const standardProducts = MOCK_PRODUCTS.filter(p => !p.isFeatured).filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const pageCount = Math.ceil(standardProducts.length / ITEMS_PER_PAGE);
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentProducts = standardProducts.slice(offset, offset + ITEMS_PER_PAGE);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 space-y-8">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Featured Products */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Featured Products</h2>
            <p className="text-sm text-muted-foreground">
              Discover our handpicked selection of premium items.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <ProductCarousel products={featuredProducts} />
          )}
        </section>

        {/* Standard Products */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">All Products</h2>
            <p className="text-sm text-muted-foreground">
              Browse our complete collection.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.image}
                  className="animate-fadeIn"
                />
              ))}
            </div>
          )}

          {/* Enhanced Pagination */}
          {pageCount > 1 && !isLoading && (
            <div className="mt-8">
              <ReactPaginate
                previousLabel="Previous"
                nextLabel="Next"
                pageCount={pageCount}
                onPageChange={handlePageChange}
                containerClassName="flex flex-wrap items-center justify-center gap-2"
                previousClassName="px-3 py-1 rounded border hover:bg-gray-100 transition-colors duration-200"
                nextClassName="px-3 py-1 rounded border hover:bg-gray-100 transition-colors duration-200"
                pageClassName="hidden sm:block"
                pageLinkClassName="px-3 py-1 rounded border hover:bg-gray-100 transition-colors duration-200"
                activeClassName="!bg-primary text-primary-foreground border-primary"
                disabledClassName="opacity-50 cursor-not-allowed"
                breakLabel="..."
                breakClassName="px-3 py-1"
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                renderOnZeroPageCount={null}
              />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;