import { Link } from "react-router-dom";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-md space-y-6 p-6 glass-card rounded-lg fade-in">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        {children}

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/signup" className="font-medium hover:text-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}