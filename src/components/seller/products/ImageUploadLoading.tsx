import { Loader2 } from "lucide-react";

export function ImageUploadLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
      <Loader2 className="h-6 w-6 text-white animate-spin" />
    </div>
  );
}