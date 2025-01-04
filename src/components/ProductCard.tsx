import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  className?: string;
}

export function ProductCard({ title, price, image, className }: ProductCardProps) {
  return (
    <Link to={`/product/${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={cn(
        "group relative overflow-hidden rounded-lg hover-lift glass-card h-full",
        "transition-all duration-300 hover:shadow-lg",
        className
      )}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm sm:text-base truncate">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">XAF {price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}