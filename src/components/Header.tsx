import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        <a href="/" className="font-semibold text-lg">
          PushNshop
        </a>
        <div className="flex-1 flex items-center gap-4 md:gap-8">
          <form className="flex-1 flex items-center max-w-sm">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 bg-muted"
              />
            </div>
          </form>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/featured" className="text-muted-foreground hover:text-foreground transition-colors">
              Featured
            </a>
            <a href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </a>
          </nav>
        </div>
        <Button>Sell Now</Button>
      </div>
    </header>
  );
}