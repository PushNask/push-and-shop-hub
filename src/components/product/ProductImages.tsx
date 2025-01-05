import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ProductImagesProps {
  images?: string[];
  title: string;
}

export const ProductImages = ({ images, title }: ProductImagesProps) => {
  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-100">
      <Carousel className="w-full">
        <CarouselContent>
          {images?.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-square relative">
                <img
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};