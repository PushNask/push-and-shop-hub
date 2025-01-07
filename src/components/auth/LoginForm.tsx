import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { AuthError, AuthApiError } from '@supabase/supabase-js';

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof formSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSessionContext();

  const form = useForm<LoginForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes('Invalid login credentials')) {
            return 'Invalid email or password. Please check your credentials and try again.';
          }
          break;
        case 422:
          return 'Invalid email format. Please enter a valid email address.';
        case 429:
          return 'Too many login attempts. Please try again later.';
      }
    }
    return 'An unexpected error occurred. Please try again.';
  };

  const onSubmit = async (values: LoginForm) => {
    try {
      setIsLoading(true);

      // First attempt to sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!data.session) {
        throw new Error("No session created after login");
      }

      // Fetch user profile with role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Check if user has admin role for /admin routes
      if (window.location.pathname.startsWith('/admin') && profile?.role !== 'admin') {
        await supabase.auth.signOut(); // Sign out if not admin
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have admin privileges to access this area.",
        });
        navigate("/login");
        return;
      }

      // Redirect based on user role
      if (profile?.role === "admin") {
        navigate("/admin/product-approvals");
      } else if (profile?.role === "seller") {
        navigate("/seller/profile");
      } else {
        navigate("/profile");
      }

      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      console.error('Login error:', error);
      
      // Clear the password field on error
      form.setValue('password', '');
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof AuthError 
          ? getErrorMessage(error)
          : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}