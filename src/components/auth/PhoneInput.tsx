import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const COUNTRIES = [
  { code: "US", name: "USA", dialCode: "+1" },
  { code: "CM", name: "Cameroon", dialCode: "+237" },
  { code: "SN", name: "Senegal", dialCode: "+221" },
  { code: "NG", name: "Nigeria", dialCode: "+234" },
  { code: "GH", name: "Ghana", dialCode: "+233" },
  { code: "CI", name: "Ivory Coast", dialCode: "+225" },
  { code: "GA", name: "Gabon", dialCode: "+241" },
  { code: "DE", name: "Germany", dialCode: "+49" },
  { code: "FR", name: "France", dialCode: "+33" },
  { code: "AE", name: "UAE", dialCode: "+971" },
  { code: "TZ", name: "Tanzania", dialCode: "+255" },
  { code: "TG", name: "Togo", dialCode: "+228" },
  { code: "KE", name: "Kenya", dialCode: "+254" },
  { code: "MU", name: "Mauritius", dialCode: "+230" },
  { code: "NA", name: "Namibia", dialCode: "+264" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PhoneInput({ value, onChange, disabled }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  
  const handleCountryChange = (countryCode: string) => {
    const country = COUNTRIES.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      // Remove any existing dial code and add the new one
      const numberWithoutDialCode = value.replace(/^\+\d+\s*/, '');
      onChange(`${country.dialCode} ${numberWithoutDialCode}`);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberWithoutDialCode = e.target.value.replace(/^\+\d+\s*/, '');
    onChange(`${selectedCountry.dialCode} ${numberWithoutDialCode}`);
  };

  return (
    <div className="flex gap-2">
      <Select
        defaultValue={selectedCountry.code}
        onValueChange={handleCountryChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name} ({country.dialCode})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        placeholder="Enter phone number"
        value={value.replace(/^\+\d+\s*/, '')}
        onChange={handlePhoneChange}
        disabled={disabled}
        className="flex-1"
      />
    </div>
  );
}