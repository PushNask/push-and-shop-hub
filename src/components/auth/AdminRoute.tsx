import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AdminRoute() {
  const { user, loading } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || profile?.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}