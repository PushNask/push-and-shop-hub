import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { REGIONS } from "@/lib/constants";
import { Admin } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminListProps {
  onRemoveAdmin: (adminId: string) => void;
}

export const AdminList = ({ onRemoveAdmin }: AdminListProps) => {
  const { toast } = useToast();
  
  const { data: admins, isLoading, error } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "admin");
      
      if (error) {
        throw error;
      }
      
      return data as Admin[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

  if (!admins?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No admin users found
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Region</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
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
                      admin.is_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {admin.is_verified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveAdmin(admin.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};