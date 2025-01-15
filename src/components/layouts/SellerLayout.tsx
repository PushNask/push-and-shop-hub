import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SellerHeader } from "./SellerHeader";
import { SellerSidebar } from "./SellerSidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SellerLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSellerAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError("Failed to verify authentication status");
          return;
        }
        
        if (!session) {
          toast.error("Please login to access the seller dashboard");
          navigate("/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          setError("Error verifying seller privileges");
          return;
        }

        if (profile?.role !== "seller") {
          toast.error("Access denied. Seller privileges required");
          navigate("/");
          return;
        }

        setError(null);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setError("An unexpected error occurred");
      }
    };

    checkSellerAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/login");
      } else if (event === 'SIGNED_IN') {
        checkSellerAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header />
        <div className="flex flex-1">
          <SellerSidebar />
          <div className="flex-1">
            <SellerHeader />
            <main className="container py-6 animate-fadeIn">
              <Outlet />
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}