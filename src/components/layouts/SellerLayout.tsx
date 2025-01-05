import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SellerHeader } from "./SellerHeader";
import { SellerSidebar } from "./SellerSidebar";

export function SellerLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <SellerSidebar />
        <div className="flex-1">
          <SellerHeader />
          <main className="container py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}