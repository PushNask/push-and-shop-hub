import { Admin } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { REGIONS } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminTableRowProps {
  admin: Admin;
  onRemoveAdmin: (adminId: string) => void;
}

export const AdminTableRow = ({ admin, onRemoveAdmin }: AdminTableRowProps) => {
  return (
    <tr className="border-t">
      <td className="p-4">{admin.email}</td>
      <td className="p-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            admin.role === "super_admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {admin.role === "super_admin" ? "Super Admin" : "Admin"}
        </span>
      </td>
      <td className="p-4">
        {REGIONS.find((r) => r.id === admin.region)?.name || 'N/A'}
      </td>
      <td className="p-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            admin.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {admin.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Admin</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this admin? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onRemoveAdmin(admin.id)}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
};