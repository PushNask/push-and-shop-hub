import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

export function SellerHeader() {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case "/seller/products":
        return "My Products";
      case "/seller/add-product":
        return "Add New Product";
      case "/seller/transactions":
        return "Transaction History";
      case "/seller/analytics":
        return "Analytics Dashboard";
      case "/seller/profile":
        return "Seller Profile";
      default:
        return "Seller Dashboard";
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="flex flex-1">
          <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
        </div>
      </div>
    </div>
  );
}