import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ProductCardImageProps {
  src?: string;
  alt: string;
}

export const ProductCardImage = ({ src, alt }: ProductCardImageProps) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="aspect-square bg-muted flex items-center justify-center">
        <ImageOff className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
      onError={() => setError(true)}
    />
  );
};