import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

interface HeaderNavProps {
  user: any;
  userRole: string | null;
  onLogout: () => Promise<void>;
}

export function HeaderNav({ user, userRole, onLogout }: HeaderNavProps) {
  const getDashboardLink = () => {
    switch (userRole) {
      case "admin":
        return "/admin/analytics";
      case "seller":
        return "/seller/products";
      default:
        return "/profile";
    }
  };

  return (
    <div className="flex-1 flex items-center justify-end gap-4 md:gap-8">
      <nav className="hidden md:flex items-center gap-6">
        <Link
          to="/featured"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Featured
        </Link>
      </nav>

      {/* Mobile Navigation */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {user ? (
            <>
              <DropdownMenuItem asChild>
                <Link to={getDashboardLink()}>Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link to="/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/signup">Sign Up</Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="hidden md:flex items-center gap-2">
        {user ? (
          <>
            <Button variant="ghost" asChild>
              <Link to={getDashboardLink()}>Dashboard</Link>
            </Button>
            <Button onClick={onLogout} variant="destructive">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}