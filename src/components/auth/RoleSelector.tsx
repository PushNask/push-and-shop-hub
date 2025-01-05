import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="flex flex-col space-y-1"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="buyer" id="buyer" />
        <Label htmlFor="buyer">Buyer</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="seller" id="seller" />
        <Label htmlFor="seller">Seller</Label>
      </div>
    </RadioGroup>
  );
}