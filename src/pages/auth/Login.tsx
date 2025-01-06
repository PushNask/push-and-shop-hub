import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoginLayout } from '@/components/auth/LoginLayout';

export default function Login() {
  const navigate = useNavigate();

  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}