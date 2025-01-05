import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AdminSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const AdminSearchBar = ({ search, onSearchChange }: AdminSearchBarProps) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search admins..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};