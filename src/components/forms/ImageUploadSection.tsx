import { FormField, FormItem, FormControl, FormDescription, FormMessage, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

interface ImageUploadSectionProps {
  form: any;
  imageUrls: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUploadSection({ form, imageUrls, onImageChange }: ImageUploadSectionProps) {
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
                className="w-full h-32 flex flex-col gap-2"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <ImagePlus className="h-8 w-8" />
                <span>Upload Images (Max 7)</span>
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onImageChange}
              />
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Upload up to 7 images of your product
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}