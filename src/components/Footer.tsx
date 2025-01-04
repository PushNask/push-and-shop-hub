import { Link } from "react-router-dom";

export function Footer() {
  const footerLinks = [
    { title: "About Us", href: "/about" },
    { title: "Contact Us", href: "/contact" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="mt-auto border-t">
      <div className="container py-8">
        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {footerLinks.map((link) => (
            <Link
              key={link.title}
              to={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </nav>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PushNshop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}