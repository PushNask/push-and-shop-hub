import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface FormHeaderProps {
  errors: boolean;
}

export function FormHeader({ errors }: FormHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium">Add New Product</h2>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to list your product.
        </p>
      </div>

      {errors && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please fix the errors in the form before submitting.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}