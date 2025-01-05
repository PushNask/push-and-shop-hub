import { supabase } from "@/integrations/supabase/client";

export const useAdminAudit = () => {
  const logAdminAction = async (action: string, details: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from('admin_audit_logs')
        .insert({
          admin_id: user.id,
          action,
          details,
          ip_address: window.location.hostname // For demo purposes. In production, you'd want to get the real IP
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  };

  return { logAdminAction };
};