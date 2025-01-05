import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  ClipboardCheck,
  CreditCard,
  LogOut,
  Menu,
  Link as LinkIcon,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminLinks: SidebarLink[] = [
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/admin/users",
    label: "User Management",
    icon: Users,
  },
  {
    href: "/admin/admin-management",
    label: "Admin Management",
    icon: UserCog,
  },
  {
    href: "/admin/links",
    label: "Link Management",
    icon: LinkIcon,
  },
  {
    href: "/product-approvals",
    label: "Product Approvals",
    icon: ClipboardCheck,
  },
  {
    href: "/admin/transactions",
    label: "Transactions",
    icon: CreditCard,
  },
];

function SidebarContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-4 py-4 flex flex-col h-full">
        <div className="px-3 py-2">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <img
              src="/lovable-uploads/032557e3-02ca-48fd-8b47-c3029d8d0104.png"
              alt="PushNshop Logo"
              className="h-8 w-8"
            />
            <span className="font-semibold text-lg">PushNshop</span>
          </Link>
          <div className="space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                  location.pathname === link.href ? "bg-accent" : "transparent"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-auto px-3 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden border-r bg-background md:block w-72">
      <SidebarContent />
    </div>
  );
}