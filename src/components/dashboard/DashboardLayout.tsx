import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  navItems: NavItem[];
}

export function DashboardLayout({ children, title, navItems }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <DashboardSidebar navItems={navItems} />
      <div className="flex-1">
        <DashboardHeader title={title} navItems={navItems} />
        <main className="container py-6">
          {children}
        </main>
      </div>
    </div>
  );
}