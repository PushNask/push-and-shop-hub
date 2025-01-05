import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginLayout } from "@/components/auth/LoginLayout";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') {
          navigate('/admin/product-approvals');
        } else if (profile?.role === 'seller') {
          navigate('/seller/profile');
        } else {
          navigate('/profile');
        }
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}