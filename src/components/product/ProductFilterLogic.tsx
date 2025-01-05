import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

interface FilterParams {
  selectedCategory: string;
  searchQuery: string;
  priceRange: {
    min: number;
    max: number;
  };
}

export function useProductFilter(products: Product[], filterParams: FilterParams) {
  const { toast } = useToast();
  const { selectedCategory, searchQuery, priceRange } = filterParams;

  const filteredProducts = products.filter(product => {
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
  });

  return filteredProducts;
}

export function useProductSort(products: Product[], sortBy: 'price' | 'date' | 'popularity') {
  return products.sort((a, b) => {
    try {
      if (sortBy === 'price') return Number(a.price) - Number(b.price);
      if (sortBy === 'date') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      return 0;
    } catch (error) {
      console.error('Error sorting products:', error);
      return 0;
    }
  });
}