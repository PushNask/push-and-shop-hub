import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from '@supabase/auth-helpers-react';

export function ProfileRedirect() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading } = useSessionContext();

  useEffect(() => {
    const checkUserRole = async () => {
      if (isLoading) return;

      if (!session) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Please log in to view your profile",
        });
        navigate("/login");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (profile) {
          if (profile.role === "admin") {
            navigate("/admin/product-approvals");
          } else if (profile.role === "seller") {
            navigate("/seller/profile");
          }
          // Regular users stay on the profile page
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile. Please try again.",
        });
      }
    };

    checkUserRole();
  }, [navigate, toast, session, isLoading]);

  return null;
}