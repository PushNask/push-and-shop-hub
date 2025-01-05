import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Loader2 } from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState({
    email: "",
    phone: "",
    country: "",
  });

  useEffect(() => {
    // Check session status first
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        navigate("/login");
        return;
      }

      if (!session) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // If session exists, proceed to load profile
      await loadProfile(session.user.id);
    };

    checkSession();
  }, [navigate, toast]);

  async function loadProfile(userId: string) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // If user is admin, redirect to admin profile
      if (profile?.role === 'admin') {
        navigate("/admin/profile");
        return;
      }

      if (profile) {
        setDefaultValues({
          email: profile.email,
          phone: profile.phone || "",
          country: profile.country || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          phone: values.phone,
          country: values.country,
        })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }
      
      localStorage.clear();
      navigate("/login");
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ProfileCard
      defaultValues={defaultValues}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onLogout={handleLogout}
    />
  );
}