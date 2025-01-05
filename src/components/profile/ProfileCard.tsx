import { Card } from "@/components/ui/card";
import { ProfileForm } from "./ProfileForm";
import { ProfileHeader } from "./ProfileHeader";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface ProfileCardProps {
  defaultValues: {
    email: string;
    phone: string;
    country: string;
  };
  isLoading: boolean;
  onSubmit: (values: any) => Promise<void>;
  onLogout: () => Promise<void>;
}

export function ProfileCard({ defaultValues, isLoading, onSubmit, onLogout }: ProfileCardProps) {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 animate-fadeIn">
      <ProfileHeader />
      <Card className="p-6 rounded-lg shadow-sm border">
        <ProfileForm
          defaultValues={defaultValues}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onLogout}
            className="w-32"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}