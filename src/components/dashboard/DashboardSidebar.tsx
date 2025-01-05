import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface DashboardSidebarProps {
  navItems: NavItem[];
}

export function DashboardSidebar({ navItems }: DashboardSidebarProps) {
  const location = useLocation();

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">PushNshop</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 p-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  location.pathname === item.href && "bg-gray-200 dark:bg-gray-700"
                )}
                asChild
              >
                <Link to={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}