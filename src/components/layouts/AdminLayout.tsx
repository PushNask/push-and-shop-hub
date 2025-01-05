import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export function AdminLayout() {
  const navigate = useNavigate();
  
  const { data: profile, isLoading } = useQuery({
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
    if (!isLoading && (!profile || profile.role !== "admin")) {
      navigate("/login");
    }
  }, [profile, isLoading, navigate]);

  if (isLoading || !profile) {
    return null;
  }

  return (
    <DashboardLayout title={getTitleFromPath(window.location.pathname)}>
      <Outlet />
    </DashboardLayout>
  );
}

function getTitleFromPath(path: string): string {
  const segments = path.split("/");
  const lastSegment = segments[segments.length - 1];
  
  const titles: Record<string, string> = {
    "analytics": "Analytics Dashboard",
    "users": "User Management",
    "links": "Link Management",
    "product-approvals": "Product Approvals",
    "transactions": "Transaction History",
    "profile": "Admin Profile"
  };
  
  return titles[lastSegment] || "Admin Dashboard";
}