import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface ProductHeaderProps {
  title: string;
  category?: string;
  price: number;
}

export function ProductHeader({ title, category, price }: ProductHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-2">
          {title}
        </h3>
        {category && (
          <Badge variant="secondary" className="text-xs whitespace-nowrap shrink-0">
            {category}
          </Badge>
        )}
      </div>
      <p className="text-xl font-bold text-primary">
        XAF {formatPrice(price)}
      </p>
    </div>
  );
}