import { BarChart3, Users, ClipboardCheck, CreditCard, Link as LinkIcon, UserCog } from "lucide-react";

export const adminNavItems = [
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Link Management",
    href: "/admin/links",
    icon: LinkIcon,
  },
  {
    title: "Product Approvals",
    href: "/admin/product-approvals",
    icon: ClipboardCheck,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: CreditCard,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: UserCog,
  },
];