import { ArrowUpDown } from "lucide-react";

interface AdminTableHeaderProps {
  onSort: (field: string) => void;
}

export const AdminTableHeader = ({ onSort }: AdminTableHeaderProps) => {
  return (
    <tr className="bg-muted/50">
      <th className="text-left p-4">
        <button
          onClick={() => onSort("email")}
          className="flex items-center gap-1 hover:text-primary"
        >
          Email
          <ArrowUpDown className="h-4 w-4" />
        </button>
      </th>
      <th className="text-left p-4">Role</th>
      <th className="text-left p-4">Region</th>
      <th className="text-left p-4">Status</th>
      <th className="text-right p-4">Actions</th>
    </tr>
  );
};