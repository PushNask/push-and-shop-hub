import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Admin, NewAdmin } from "@/types/admin";

const INITIAL_ADMINS: Admin[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "super_admin",
    region: "cm-center",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    region: "cm-littoral",
    status: "active",
  },
];

export const useAdminManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>(INITIAL_ADMINS);
  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    name: "",
    email: "",
    role: "admin",
    region: "",
  });

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.region) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const admin: Admin = {
      id: (admins.length + 1).toString(),
      ...newAdmin,
      role: newAdmin.role as "admin" | "super_admin",
      status: "active",
    };

    setAdmins([...admins, admin]);
    setNewAdmin({ name: "", email: "", role: "admin", region: "" });
    toast({
      title: "Admin Added",
      description: `${admin.name} has been added as an admin.`,
    });
  };

  const handleRemoveAdmin = (adminId: string) => {
    setAdmins(admins.filter((admin) => admin.id !== adminId));
    toast({
      title: "Admin Removed",
      description: "The admin has been removed successfully.",
    });
  };

  return {
    admins,
    newAdmin,
    setNewAdmin,
    handleAddAdmin,
    handleRemoveAdmin,
  };
};