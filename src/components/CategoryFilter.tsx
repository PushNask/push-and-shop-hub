import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "Home & Furniture",
  "Building Materials & Hardware",
  "Automotive & Transportation",
  "Health & Wellness",
  "Office & School Supplies",
  "Sports & Outdoor Gear",
  "Services & Digital Goods",
  "Properties",
  "Business",
  "Agricultural",
  "Arts, Crafts",
  "Clothing & Fashion",
  "Electronics & Appliances",
  "Beauty & Personal Care",
  "Containers"
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(category)}
          className="whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}