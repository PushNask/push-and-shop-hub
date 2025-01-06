import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthLayout } from '@/components/layouts/AuthLayout';

export default function Register() {
  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
        <RegisterForm />
      </div>
    </AuthLayout>
  );
}