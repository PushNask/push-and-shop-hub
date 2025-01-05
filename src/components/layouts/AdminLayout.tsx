import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const navigate = useNavigate();
  
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      return profile;
    },
  });

  useEffect(() => {
    if (profile && profile.role !== "admin") {
      navigate("/login");
    }
  }, [profile, navigate]);

  if (!profile) {
    return null;
  }

  return <DashboardLayout title={title}>{children}</DashboardLayout>;
}