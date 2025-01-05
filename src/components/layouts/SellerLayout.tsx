import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SellerHeader } from "./SellerHeader";
import { SellerSidebar } from "./SellerSidebar";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function SellerLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSellerAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please login to access the seller dashboard");
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!profile || profile.role !== "seller") {
        toast.error("Access denied. Seller privileges required");
        navigate("/");
      }
    };

    checkSellerAuth();
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <SellerSidebar />
        <div className="flex-1">
          <SellerHeader />
          <main className="container py-6 animate-fadeIn">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}