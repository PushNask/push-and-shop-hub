import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader title={title} />
        <main className="container py-6">
          {children}
        </main>
      </div>
    </div>
  );
}