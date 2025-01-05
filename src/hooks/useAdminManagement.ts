import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Admin, NewAdmin } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAudit } from "./useAdminAudit";

export const useAdminManagement = () => {
  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    name: "",
    email: "",
    role: "admin",
    region: "",
  });

  const { logAdminAction } = useAdminAudit();

  const handleAddAdmin = async () => {
    try {
      if (!newAdmin.name || !newAdmin.email || !newAdmin.region) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const { error, data } = await supabase
        .from("profiles")
        .insert([
          {
            ...newAdmin,
            role: newAdmin.role as "admin" | "super_admin",
            is_verified: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('create_admin', {
        admin_email: newAdmin.email,
        admin_role: newAdmin.role,
        admin_region: newAdmin.region
      });

      setNewAdmin({ name: "", email: "", role: "admin", region: "" });
      toast({
        title: "Admin Added",
        description: `${newAdmin.name} has been added as an admin.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add admin",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    try {
      const { data: adminData } = await supabase
        .from("profiles")
        .select("email, role, region")
        .eq("id", adminId)
        .single();

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", adminId);

      if (error) throw error;

      await logAdminAction('remove_admin', {
        admin_id: adminId,
        admin_email: adminData?.email,
        admin_role: adminData?.role,
        admin_region: adminData?.region
      });

      toast({
        title: "Admin Removed",
        description: "The admin has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove admin",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    newAdmin,
    setNewAdmin,
    handleAddAdmin,
    handleRemoveAdmin,
  };
};