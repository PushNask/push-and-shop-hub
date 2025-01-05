import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Admin, NewAdmin } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";

export const useAdminManagement = () => {
  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    name: "",
    email: "",
    role: "admin",
    region: "",
  });

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

      const { error } = await supabase
        .from("profiles")
        .insert([
          {
            ...newAdmin,
            role: newAdmin.role as "admin" | "super_admin",
            is_verified: true,
          },
        ]);

      if (error) throw error;

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
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", adminId);

      if (error) throw error;

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