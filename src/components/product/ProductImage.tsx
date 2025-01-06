interface ProductImageProps {
  image?: string;
  title: string;
}

export function ProductImage({ image, title }: ProductImageProps) {
  return (
    <div className="aspect-square overflow-hidden bg-gray-100">
      <img
        src={image || "/placeholder.svg"}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}