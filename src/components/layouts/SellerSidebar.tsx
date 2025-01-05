import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  DollarSign, 
  BarChart, 
  User,
  X 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sellerNavItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/seller",
  },
  {
    title: "My Products",
    icon: Package,
    href: "/seller/products",
  },
  {
    title: "Add Product",
    icon: PlusCircle,
    href: "/seller/add-product",
  },
  {
    title: "Transactions",
    icon: DollarSign,
    href: "/seller/transactions",
  },
  {
    title: "Analytics",
    icon: BarChart,
    href: "/seller/analytics",
  },
  {
    title: "Profile",
    icon: User,
    href: "/seller/profile",
  },
];

interface SellerSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SellerSidebar({ open, onOpenChange }: SellerSidebarProps) {
  const location = useLocation();

  return (
    <Sidebar
      className={cn(
        "fixed left-0 top-0 z-20 h-full w-64 border-r bg-background transition-transform duration-300",
        !open && "-translate-x-full"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link to="/seller" className="flex items-center space-x-2">
          <span className="font-semibold">PushNshop Seller</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sellerNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    data-active={location.pathname === item.href}
                  >
                    <Link to={item.href} className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}