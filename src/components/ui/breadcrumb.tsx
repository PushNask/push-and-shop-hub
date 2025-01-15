import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  children: React.ReactNode;
}

export function Breadcrumb({ children, className, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex", className)}
      {...props}
    >
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">{children}</ol>
    </nav>
  );
}

export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {
  children: React.ReactNode;
}

export function BreadcrumbItem({ children, className, ...props }: BreadcrumbItemProps) {
  return (
    <li className={cn("flex items-center gap-2", className)} {...props}>
      {children}
      <ChevronRight className="h-4 w-4" />
    </li>
  );
}

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode;
}

export function BreadcrumbLink({ className, children, ...props }: BreadcrumbLinkProps) {
  return (
    <Link
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    >
      {children}
    </Link>
  );
}