import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function SellerProfile() {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    email: session?.user?.email || "",
    phone: "",
    country: "cm",
  };

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          phone: values.phone,
          country: values.country,
        })
        .eq("id", session?.user?.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProfileCard
      defaultValues={defaultValues}
      isLoading={isLoading}
      onSubmit={onSubmit}
      onLogout={handleLogout}
    />
  );
}