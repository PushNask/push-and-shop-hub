import { UserCog } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="mb-8 flex items-center gap-2">
      <UserCog className="h-8 w-8" />
      <h1 className="text-2xl font-bold">User Profile</h1>
    </div>
  );
}