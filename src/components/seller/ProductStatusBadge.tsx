import { Badge } from "@/components/ui/badge";

interface ProductStatusBadgeProps {
  status: string;
}

export const ProductStatusBadge = ({ status }: ProductStatusBadgeProps) => {
  const variants = {
    active: "bg-green-500",
    expired: "bg-red-500",
    pending: "bg-yellow-500"
  };
  
  return (
    <Badge className={`${variants[status as keyof typeof variants]} text-white`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};