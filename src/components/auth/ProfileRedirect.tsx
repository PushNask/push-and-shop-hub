import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function ProfileRedirect() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log("Current user:", user.email); // Debug log
        
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        console.log("User profile:", profile); // Debug log
        
        if (error) {
          console.error("Error fetching profile:", error);
        }

        if (profile) {
          if (profile.role === "admin") {
            navigate("/admin/product-approvals");
          } else if (profile.role === "seller") {
            navigate("/seller/profile");
          }
          // Regular users stay on the profile page
        }
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Please log in to view your profile",
        });
        navigate("/login");
      }
    };

    checkUserRole();
  }, [navigate, toast]);

  return null;
}