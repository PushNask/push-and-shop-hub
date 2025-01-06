import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DeliveryValidationProps {
  showError: boolean;
}

export function DeliveryValidation({ showError }: DeliveryValidationProps) {
  if (!showError) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Please select at least one delivery option
      </AlertDescription>
    </Alert>
  );
}