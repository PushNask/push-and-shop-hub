import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      {children}
    </div>
  );
}