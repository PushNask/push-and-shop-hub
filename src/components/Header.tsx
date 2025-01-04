import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
          </nav>
        </div>
        <div className="flex items-center gap-2">
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