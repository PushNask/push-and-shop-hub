import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Trash2, Search, ArrowUpDown } from "lucide-react";
import { REGIONS } from "@/lib/constants";
import { Admin } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AdminListProps {
  onRemoveAdmin: (adminId: string) => void;
}

export const AdminList = ({ onRemoveAdmin }: AdminListProps) => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admins", page, search, sortField, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("role", "admin")
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      if (sortField) {
        query = query.order(sortField, { ascending: sortOrder === "asc" });
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        admins: data.map(profile => ({
          ...profile,
          status: profile.is_verified ? "active" : "inactive"
        })) as Admin[],
        totalCount: count || 0
      };
    },
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    try {
      await onRemoveAdmin(adminId);
      refetch();
      toast({
        title: "Success",
        description: "Admin removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove admin",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch admin users",
      variant: "destructive",
    });
    return null;
  }

  const totalPages = Math.ceil((data?.totalCount || 0) / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search admins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("email")}
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
            </thead>
            <tbody>
              {data?.admins.map((admin) => (
                <tr key={admin.id} className="border-t">
                  <td className="p-4">{admin.name || 'N/A'}</td>
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
                          <AlertDialogAction
                            onClick={() => handleRemoveAdmin(admin.id)}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};