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
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user.id);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        return;
      }

      if (data) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        // If no session or session error, just clear local state and redirect
        setUser(null);
        setUserRole(null);
        navigate("/");
        return;
      }

      // If we have a session, sign out properly
      const { error } = await supabase.auth.signOut();
      
      // Clear local state regardless of error
      setUser(null);
      setUserRole(null);

      if (error) {
        // Handle specific error cases
        if (error.message?.includes('refresh_token_not_found') || 
            error.message?.includes('session_not_found')) {
          navigate("/");
          return;
        }
        throw error;
      }

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