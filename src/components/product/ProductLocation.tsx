import { MapPin } from "lucide-react";

interface ProductLocationProps {
  country?: string;
}

export const ProductLocation = ({ country }: ProductLocationProps) => {
  if (!country) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="h-4 w-4" aria-hidden="true" />
      <span>{country}</span>
    </div>
  );
};