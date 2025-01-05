import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SellerSidebar } from "./SellerSidebar";
import { SellerHeader } from "./SellerHeader";

export function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <SellerSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-0"}`}>
        <SellerHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="container py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}