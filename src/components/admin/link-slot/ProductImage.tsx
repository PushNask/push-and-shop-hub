interface ProductImageProps {
  src: string;
  alt: string;
}

export function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full"
      />
    </div>
  );
}