import { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import ReactPaginate from "react-paginate";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data - replace with actual data later
const MOCK_PRODUCTS = Array.from({ length: 50 }, (_, i) => {
  // Randomly assign categories to products for demo purposes
  const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports"];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  return {
    id: `p${i + 1}`,
    title: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 900000) + 100000,
    image: "/placeholder.svg",
    category: randomCategory, // Add category to each product
  };
});

const ITEMS_PER_PAGE = 12;

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setCurrentPage(0);
    }, 300),
    []
  );

  // Filter products based on search and category
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(offset, offset + ITEMS_PER_PAGE);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 space-y-6">
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
          
          {/* Product Grid */}
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

          {/* Pagination */}
          {pageCount > 1 && (
            <ReactPaginate
              previousLabel="Previous"
              nextLabel="Next"
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName="flex items-center justify-center gap-2 mt-8"
              previousClassName="px-3 py-1 rounded border hover:bg-gray-100"
              nextClassName="px-3 py-1 rounded border hover:bg-gray-100"
              pageClassName="px-3 py-1 rounded border hover:bg-gray-100"
              activeClassName="!bg-primary text-primary-foreground border-primary"
              disabledClassName="opacity-50 cursor-not-allowed"
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;