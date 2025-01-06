import { Badge } from "@/components/ui/badge";

interface ProductTitleProps {
  title: string;
  category?: string;
}

export const ProductTitle = ({ title, category }: ProductTitleProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="font-medium text-sm sm:text-base truncate">{title}</h3>
      {category && (
        <Badge variant="secondary" className="text-xs">
          {category}
        </Badge>
      )}
    </div>
  );
};