"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { Logo } from "./ui/Logo";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-100 bg-white transition-shadow duration-300",
        isScrolled && "shadow-sm"
      )}
    >
      <nav className="container flex items-center justify-between h-16 px-6 md:px-12">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo width={120} height={48} showText={false} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors duration-200 hover:text-secondary",
                pathname === item.href
                  ? "text-secondary font-semibold"
                  : "text-foreground/70"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-foreground/70 hover:bg-gray-100 transition-colors"
        >
          {mobileMenuOpen ? (
            <HiX className="h-5 w-5" />
          ) : (
            <HiMenu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container py-4 space-y-1 px-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
                  pathname === item.href
                    ? "bg-secondary/10 text-secondary font-semibold"
                    : "text-foreground/70 hover:bg-gray-50 hover:text-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
