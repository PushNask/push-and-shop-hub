import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, UserCog } from "lucide-react";

// Mock data - replace with actual API calls later
const REGIONS = [
  { id: "cm-center", name: "Cameroon - Center" },
  { id: "cm-littoral", name: "Cameroon - Littoral" },
  { id: "cm-west", name: "Cameroon - West" },
  { id: "ng-lagos", name: "Nigeria - Lagos" },
  { id: "ng-abuja", name: "Nigeria - Abuja" },
];

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  region: string;
  status: "active" | "inactive";
}

// Mock admins data - replace with actual API calls later
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

const AdminManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>(INITIAL_ADMINS);
  const [newAdmin, setNewAdmin] = useState({
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <UserCog className="h-6 w-6" />
          Admin Management
        </h1>

        {/* Add New Admin Form */}
        <div className="bg-card p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Admin</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Name"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            />
            <Select
              value={newAdmin.region}
              onValueChange={(value) => setNewAdmin({ ...newAdmin, region: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-4">
              <RadioGroup
                value={newAdmin.role}
                onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value })}
                className="flex items-center gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <label htmlFor="admin">Admin</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="super_admin" id="super_admin" />
                  <label htmlFor="super_admin">Super Admin</label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <Button onClick={handleAddAdmin} className="mt-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </div>

        {/* Admins List */}
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
                    <td className="p-4">{admin.name}</td>
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
                      {REGIONS.find((r) => r.id === admin.region)?.name}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAdmin(admin.id)}
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
      </div>
    </div>
  );
};

export default AdminManagement;