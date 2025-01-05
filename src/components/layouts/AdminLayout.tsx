import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { adminNavItems } from "@/components/admin/navigation/AdminNav";

export function AdminLayout() {
  return (
    <AdminAuthGuard>
      <DashboardLayout 
        title={getTitleFromPath(window.location.pathname)}
        navItems={adminNavItems}
      >
        <Outlet />
      </DashboardLayout>
    </AdminAuthGuard>
  );
}

function getTitleFromPath(path: string): string {
  const segments = path.split("/");
  const lastSegment = segments[segments.length - 1];
  
  const titles: Record<string, string> = {
    "analytics": "Analytics Dashboard",
    "users": "User Management",
    "links": "Link Management",
    "product-approvals": "Product Approvals",
    "transactions": "Transaction History",
    "profile": "Admin Profile"
  };
  
  return titles[lastSegment] || "Admin Dashboard";
}