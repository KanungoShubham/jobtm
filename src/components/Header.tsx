"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiX, HiLogin } from "react-icons/hi";
import { Button } from "./ui/Button";
import { ThemeToggle } from "./ui/ThemeToggle";
import { Logo } from "./ui/Logo";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
  { name: "Marketing", href: "/marketing-materials" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Check if scrolled from top
      setIsScrolled(currentScrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 animate-fade-in-down",
      isScrolled
        ? "bg-background/98 backdrop-blur-md shadow-lg"
        : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
      <nav className="container flex items-center justify-between h-16 px-6 md:px-12">
        {/* Logo */}
        <Link href="/" className="hover:scale-105 transition-all duration-300 animate-scale-in">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-primary hover:-translate-y-0.5 hover:scale-110 animate-fade-in",
                pathname === item.href
                  ? "text-primary"
                  : "text-foreground/80"
              )}
              style={{ animationDelay: `${100 + index * 50}ms` }}
            >
              {item.name}
            </Link>
          ))}
          <div className="animate-scale-in animate-delay-400">
            <ThemeToggle />
          </div>
          <Link href="/auth" className="animate-scale-in-bounce animate-delay-500">
            <Button size="sm" className="gap-2 hover-lift hover-shine">
              <HiLogin className="h-4 w-4" />
              Sign in
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-accent transition-all duration-300 hover:scale-110 hover:rotate-90 animate-scale-in"
        >
          {mobileMenuOpen ? (
            <HiX className="h-6 w-6" />
          ) : (
            <HiMenu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background animate-slide-down">
          <div className="container py-4 space-y-3">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-md transition-all duration-300 hover:scale-105 hover:translate-x-2 animate-slide-in-left",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-accent hover:text-foreground"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/auth" className="w-full animate-fade-in-up animate-delay-300">
              <Button className="w-full gap-2 mt-4 hover-shine">
                <HiLogin className="h-4 w-4" />
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
