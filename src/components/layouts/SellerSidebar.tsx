import { Link, useLocation } from "react-router-dom";
import { BarChart3, Package, CreditCard, Settings, Plus, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarNavMain,
  SidebarNavLink,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function SellerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/seller" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span className="text-lg">PushNshop Seller</span>
        </Link>
      </SidebarHeader>
      <SidebarNav>
        <SidebarNavMain>
          <SidebarGroup>
            <SidebarGroupContent className="space-y-1">
              <SidebarNavLink asChild active={isActive("/seller/products")}>
                <Link to="/seller/products" className="flex items-center gap-2 px-3 py-2">
                  <Package className="h-4 w-4" />
                  <span>Products</span>
                </Link>
              </SidebarNavLink>
              
              <SidebarNavLink asChild active={isActive("/seller/add-product")}>
                <Link to="/seller/add-product" className="flex items-center gap-2 px-3 py-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </Link>
              </SidebarNavLink>
              
              <SidebarNavLink asChild active={isActive("/seller/transactions")}>
                <Link to="/seller/transactions" className="flex items-center gap-2 px-3 py-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Transactions</span>
                </Link>
              </SidebarNavLink>
              
              <SidebarNavLink asChild active={isActive("/seller/analytics")}>
                <Link to="/seller/analytics" className="flex items-center gap-2 px-3 py-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
              </SidebarNavLink>
              
              <SidebarNavLink asChild active={isActive("/seller/profile")}>
                <Link to="/seller/profile" className="flex items-center gap-2 px-3 py-2">
                  <Settings className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </SidebarNavLink>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarNavMain>
        
        <div className="mt-auto p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarNav>
    </Sidebar>
  );
}