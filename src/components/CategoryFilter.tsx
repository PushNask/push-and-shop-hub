import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/lib/constants/categories";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState({
    left: false,
    right: false,
  });

  // Check if scroll buttons should be shown
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowScrollButtons({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 1, // -1 for rounding errors
      });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Scroll buttons */}
      {showScrollButtons.left && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-md"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      {showScrollButtons.right && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-md"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Categories container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-2 px-2 scrollbar-none scroll-smooth"
        onScroll={checkScroll}
      >
        {PRODUCT_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(category)}
            className={cn(
              "whitespace-nowrap transition-all duration-200",
              selectedCategory === category 
                ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                : "hover:bg-primary/10"
            )}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Scroll indicators */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-muted">
        {scrollContainerRef.current && (
          <div
            className="h-full bg-primary transition-all duration-200"
            style={{
              width: scrollContainerRef.current
                ? `${(scrollContainerRef.current.scrollLeft / (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth)) * 100}%`
                : "0%",
              transform: `translateX(${scrollContainerRef.current.scrollLeft}px)`,
            }}
          />
        )}
      </div>
    </div>
  );
}