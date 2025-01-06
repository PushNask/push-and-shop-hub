interface ProductImageProps {
  image?: string;
  title: string;
}

export function ProductImage({ image, title }: ProductImageProps) {
  return (
    <div className="relative w-full h-full bg-gray-100">
      <img
        src={image || "/placeholder.svg"}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}