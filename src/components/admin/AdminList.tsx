import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { Admin } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminTableRow } from "./table/AdminTableRow";
import { AdminTableHeader } from "./table/AdminTableHeader";
import { AdminSearchBar } from "./search/AdminSearchBar";
import { AdminPagination } from "./pagination/AdminPagination";

interface AdminListProps {
  onRemoveAdmin: (adminId: string) => void;
}

export const AdminList = ({ onRemoveAdmin }: AdminListProps) => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("email");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 10;

  const handleSort = useCallback((field: string) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  }, [sortOrder]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admins", page, search, sortField, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("role", "admin")
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      if (search) {
        query = query.ilike("email", `%${search}%`);
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
      <AdminSearchBar search={search} onSearchChange={handleSearchChange} />

      <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <AdminTableHeader onSort={handleSort} />
            </thead>
            <tbody>
              {data?.admins.map((admin) => (
                <AdminTableRow
                  key={admin.id}
                  admin={admin}
                  onRemoveAdmin={handleRemoveAdmin}
                />
              ))}
            </tbody>
          </table>
        </div>

        <AdminPagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};