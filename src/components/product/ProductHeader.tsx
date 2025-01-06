import { Badge } from "@/components/ui/badge";

interface ProductHeaderProps {
  title: string;
  category?: string;
  price: number;
}

export function ProductHeader({ title, category, price }: ProductHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-base sm:text-lg truncate">{title}</h3>
        {category && (
          <Badge variant="secondary" className="text-xs shrink-0">
            {category}
          </Badge>
        )}
      </div>
      <p className="text-xl font-bold text-primary">XAF {price.toLocaleString()}</p>
    </div>
  );
}