import { UserCog } from "lucide-react";
import { AdminList } from "@/components/admin/AdminList";
import { AddAdminForm } from "@/components/admin/AddAdminForm";
import { useAdminManagement } from "@/hooks/useAdminManagement";

const AdminManagement = () => {
  const { admins, newAdmin, setNewAdmin, handleAddAdmin, handleRemoveAdmin } = useAdminManagement();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <UserCog className="h-6 w-6" />
          Admin Management
        </h1>

        <AddAdminForm
          newAdmin={newAdmin}
          onAdminChange={setNewAdmin}
          onAddAdmin={handleAddAdmin}
        />

        <AdminList
          admins={admins}
          onRemoveAdmin={handleRemoveAdmin}
        />
      </div>
    </div>
  );
};

export default AdminManagement;