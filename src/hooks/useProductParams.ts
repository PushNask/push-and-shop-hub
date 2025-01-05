import { useState, useEffect } from "react";
import { useUrlParams } from "@/hooks/useUrlParams";

interface ProductParams {
  viewMode: 'grid' | 'list';
  currentPage: number;
  sortBy: 'price' | 'date' | 'popularity';
  selectedCategory: string;
  searchQuery: string;
  priceRange: {
    min: number;
    max: number;
  };
}

export function useProductParams(): [
  ProductParams,
  (updates: Partial<ProductParams>) => void
] {
  const { updateParams, getParam } = useUrlParams();

  const [params, setParams] = useState<ProductParams>({
    viewMode: (getParam('view') as 'grid' | 'list') || 'grid',
    currentPage: Number(getParam('page')) || 1,
    sortBy: (getParam('sort') as 'price' | 'date' | 'popularity') || 'date',
    selectedCategory: getParam('category') || 'all',
    searchQuery: getParam('search') || '',
    priceRange: {
      min: Number(getParam('minPrice')) || 0,
      max: Number(getParam('maxPrice')) || Infinity
    }
  });

  useEffect(() => {
    updateParams({
      view: params.viewMode,
      page: params.currentPage.toString(),
      sort: params.sortBy,
      category: params.selectedCategory,
      search: params.searchQuery,
      minPrice: params.priceRange.min.toString(),
      maxPrice: params.priceRange.max === Infinity ? '' : params.priceRange.max.toString()
    });
  }, [params]);

  const updateProductParams = (updates: Partial<ProductParams>) => {
    setParams(prev => ({ ...prev, ...updates }));
  };

  return [params, updateProductParams];
}