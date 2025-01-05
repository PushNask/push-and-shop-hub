import * as React from "react"
import { cn } from "@/lib/utils"

export function SidebarNav({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="nav"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

export function SidebarNavHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="nav-header"
      className={cn("flex items-center gap-2 px-2", className)}
      {...props}
    />
  )
}

export function SidebarNavHeaderTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="nav-header-title"
      className={cn("font-semibold", className)}
      {...props}
    />
  )
}

export function SidebarNavMain({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="nav-main"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

export function SidebarNavLink({
  asChild = false,
  active = false,
  className,
  ...props
}: {
  asChild?: boolean
  active?: boolean
} & React.ComponentProps<"a">) {
  const Comp = asChild ? React.Fragment : "a"
  return (
    <Comp
      data-sidebar="nav-link"
      data-active={active}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground",
        active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
        className
      )}
      {...props}
    />
  )
}