"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiMenu, HiX, HiChevronDown, HiOfficeBuilding, HiUser, HiLogout, HiViewGrid, HiSpeakerphone } from "react-icons/hi";
import { Logo } from "./ui/Logo";
import { cn } from "@/lib/utils";
import { employerAuth, jobseekerAuth, advertiserAuth, RoleUser } from "@/lib/roleAuth";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

type Session = { role: "employer" | "jobseeker" | "advertiser"; user: RoleUser; color: string; dashboardHref: string };

function readSession(): Session | null {
  const empToken = employerAuth.getToken();
  if (empToken) {
    const user = employerAuth.getUser();
    if (user) return { role: "employer", user, color: "#7C3AED", dashboardHref: "/employer/dashboard" };
  }
  const jsToken = jobseekerAuth.getToken();
  if (jsToken) {
    const user = jobseekerAuth.getUser();
    if (user) return { role: "jobseeker", user, color: "#0EA5E9", dashboardHref: "/jobseeker/home" };
  }
  const advToken = advertiserAuth.getToken();
  if (advToken) {
    const user = advertiserAuth.getUser();
    if (user) return { role: "advertiser", user, color: "#F59E0B", dashboardHref: "/advertiser" };
  }
  return null;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [session, setSession] = React.useState<Session | null>(null);
  const [sessionReady, setSessionReady] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const loginRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setSession(readSession());
    setSessionReady(true);
  }, [pathname]);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const signOut = () => {
    if (session?.role === "employer") employerAuth.clearSession();
    if (session?.role === "jobseeker") jobseekerAuth.clearSession();
    if (session?.role === "advertiser") advertiserAuth.clearSession();
    setSession(null);
    setLoginOpen(false);
    router.push("/");
  };

  const initial = (session?.user.name ?? (session?.role === "employer" ? "E" : session?.role === "advertiser" ? "A" : "J")).charAt(0).toUpperCase();

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

          {!sessionReady ? (
            <div className="w-24 h-9 rounded-lg bg-gray-100 animate-pulse ml-4" />
          ) : session ? (
            <div ref={loginRef} className="relative pl-4 border-l border-gray-200">
              <button
                onClick={() => setLoginOpen((v) => !v)}
                className="flex items-center gap-2 text-sm font-semibold pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold" style={{ backgroundColor: session.color }}>
                  {initial}
                </span>
                <span className="text-foreground/80 max-w-[120px] truncate">{session.user.name || (session.role === "employer" ? "Employer" : session.role === "advertiser" ? "Advertiser" : "Job Seeker")}</span>
                <HiChevronDown className={cn("h-4 w-4 text-foreground/40 transition-transform", loginOpen && "rotate-180")} />
              </button>
              {loginOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-foreground truncate">{session.user.name || "—"}</p>
                    <p className="text-xs text-foreground/40 capitalize">{session.role} account</p>
                  </div>
                  <Link
                    href={session.dashboardHref}
                    onClick={() => setLoginOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
                  >
                    <HiViewGrid className="h-4 w-4 text-foreground/50" />
                    Dashboard
                  </Link>
                  <Link
                    href={session.role === "employer" ? "/employer/profile" : session.role === "advertiser" ? "/advertiser" : "/jobseeker/profile"}
                    onClick={() => setLoginOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors border-t border-gray-100"
                  >
                    <HiUser className="h-4 w-4 text-foreground/50" />
                    Profile
                  </Link>
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                  >
                    <HiLogout className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="pl-4 border-l border-gray-200">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90 bg-secondary"
              >
                Login
              </Link>
            </div>
          )}
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

            {session ? (
              <div className="pt-3 mt-2 border-t border-gray-100">
                <div className="flex items-center gap-3 px-4 py-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold" style={{ backgroundColor: session.color }}>
                    {initial}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{session.user.name || "—"}</p>
                    <p className="text-xs text-foreground/40 capitalize">{session.role} account</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href={session.dashboardHref}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: session.color }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <HiViewGrid className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); signOut(); }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50"
                  >
                    <HiLogout className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-3 mt-2 border-t border-gray-100">
                <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-foreground/40">Login</p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/employer/login"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: "#7C3AED" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <HiOfficeBuilding className="h-4 w-4" />
                    Employer Login
                  </Link>
                  <Link
                    href="/jobseeker/login"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: "#0EA5E9" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <HiUser className="h-4 w-4" />
                    Job Seeker Login
                  </Link>
                  <Link
                    href="/advertiser/login"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: "#F59E0B" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <HiSpeakerphone className="h-4 w-4" />
                    Ad Center Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
