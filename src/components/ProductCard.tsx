import { cn } from "@/lib/utils";

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  className?: string;
}

export function ProductCard({ title, price, image, className }: ProductCardProps) {
  return (
    <div className={cn("group relative overflow-hidden rounded-lg hover-lift glass-card", className)}>
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg truncate">{title}</h3>
        <p className="text-muted-foreground mt-1">XAF {price.toLocaleString()}</p>
      </div>
    </div>
  );
}