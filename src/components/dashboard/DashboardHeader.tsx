import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        <DashboardSidebar />
        <div className="flex flex-1">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      </div>
    </div>
  );
}