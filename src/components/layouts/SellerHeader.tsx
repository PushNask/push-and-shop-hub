import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SellerHeaderProps {
  onMenuClick: () => void;
}

export function SellerHeader({ onMenuClick }: SellerHeaderProps) {
  return (
    <header className="sticky top-0 z-10 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center gap-4 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
    </header>
  );
}