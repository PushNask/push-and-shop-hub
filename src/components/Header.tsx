import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HeaderNav } from "./navigation/HeaderNav";

export function Header() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) throw error;
      if (data) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear local state
      setUser(null);
      setUserRole(null);

      // Navigate to home page
      navigate("/");

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

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
        <HeaderNav 
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
}