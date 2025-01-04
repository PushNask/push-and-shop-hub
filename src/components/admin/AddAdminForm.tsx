import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle } from "lucide-react";
import { REGIONS } from "@/lib/constants";
import { NewAdmin } from "@/types/admin";

interface AddAdminFormProps {
  newAdmin: NewAdmin;
  onAdminChange: (admin: NewAdmin) => void;
  onAddAdmin: () => void;
}

export const AddAdminForm = ({ newAdmin, onAdminChange, onAddAdmin }: AddAdminFormProps) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border mb-8">
      <h2 className="text-lg font-semibold mb-4">Add New Admin</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Name"
          value={newAdmin.name}
          onChange={(e) => onAdminChange({ ...newAdmin, name: e.target.value })}
        />
        <Input
          placeholder="Email"
          type="email"
          value={newAdmin.email}
          onChange={(e) => onAdminChange({ ...newAdmin, email: e.target.value })}
        />
        <Select
          value={newAdmin.region}
          onValueChange={(value) => onAdminChange({ ...newAdmin, region: value })}
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
            onValueChange={(value) => onAdminChange({ ...newAdmin, role: value })}
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
      <Button onClick={onAddAdmin} className="mt-4">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Admin
      </Button>
    </div>
  );
};