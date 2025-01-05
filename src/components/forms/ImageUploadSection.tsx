import { FormField, FormItem, FormControl, FormDescription, FormMessage, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadSectionProps {
  form: any;
  imageUrls: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: (index: number) => void;
  maxSize?: number;
  acceptedTypes?: string[];
}

export function ImageUploadSection({ 
  form, 
  imageUrls, 
  onImageChange, 
  onImageRemove,
  maxSize = 2 * 1024 * 1024, // Default 2MB
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
}: ImageUploadSectionProps) {
  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Product Images</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full h-32 flex flex-col gap-2",
                  imageUrls.length >= 7 && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={imageUrls.length >= 7}
              >
                <ImagePlus className="h-8 w-8" />
                <span>Upload Images (Max 7)</span>
                <span className="text-sm text-muted-foreground">
                  {imageUrls.length}/7 images uploaded
                </span>
              </Button>
              <input
                id="image-upload"
                type="file"
                accept={acceptedTypes.join(",")}
                multiple
                className="hidden"
                onChange={onImageChange}
                disabled={imageUrls.length >= 7}
              />
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => onImageRemove(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Upload up to 7 images of your product. Maximum size: {Math.round(maxSize / (1024 * 1024))}MB
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}