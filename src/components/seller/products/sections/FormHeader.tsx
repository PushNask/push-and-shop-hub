import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface FormHeaderProps {
  errors: boolean;
}

export function FormHeader({ errors }: FormHeaderProps) {
  return (
    <div className="space-y-4">
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