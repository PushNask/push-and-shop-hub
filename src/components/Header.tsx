import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/032557e3-02ca-48fd-8b47-c3029d8d0104.png" 
            alt="PushNshop Logo" 
            className="h-8 w-8"
          />
          <span className="font-semibold text-lg">PushNshop</span>
        </Link>
        <div className="flex-1 flex items-center justify-end gap-4 md:gap-8">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/featured" className="text-muted-foreground hover:text-foreground transition-colors">
              Featured
            </Link>
            <Link to="/product-approvals" className="text-muted-foreground hover:text-foreground transition-colors">
              Product Approvals
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
              <DropdownMenuItem asChild>
                <Link to="/">Index</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/signup">Sign Up</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/forgot-password">Forgot Password</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/product-approvals">Product Approvals</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}