import { Link, useLocation } from "react-router-dom";
import { BarChart3, Package, CreditCard, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarNavHeader,
  SidebarNavHeaderTitle,
  SidebarNavMain,
  SidebarNavLink,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuContent,
  SidebarMenuHeader,
  SidebarMenuTrigger,
} from "@/components/ui/sidebar";

export function SellerSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/seller" className="flex items-center gap-2 font-semibold">
          PushNshop Seller
        </Link>
      </SidebarHeader>
      <SidebarNav>
        <SidebarNavMain>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarNavLink asChild active={isActive("/seller/products")}>
                <Link to="/seller/products">
                  <Package className="h-4 w-4" />
                  Products
                </Link>
              </SidebarNavLink>
              <SidebarNavLink asChild active={isActive("/seller/transactions")}>
                <Link to="/seller/transactions">
                  <CreditCard className="h-4 w-4" />
                  Transactions
                </Link>
              </SidebarNavLink>
              <SidebarNavLink asChild active={isActive("/seller/analytics")}>
                <Link to="/seller/analytics">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
              </SidebarNavLink>
              <SidebarNavLink asChild active={isActive("/seller/profile")}>
                <Link to="/seller/profile">
                  <Settings className="h-4 w-4" />
                  Profile
                </Link>
              </SidebarNavLink>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarNavMain>
      </SidebarNav>
    </Sidebar>
  );
}