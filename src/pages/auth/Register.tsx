import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            phone: data.phone,
            country: data.country,
          },
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md space-y-6 p-6 glass-card rounded-lg fade-in">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">
            Enter your details to create your account
          </p>
        </div>

        <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </AuthLayout>
  );
}