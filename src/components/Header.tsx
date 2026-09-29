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
  const isHome = pathname === "/";
  const dark = isHome; // transparent-over-hero, then floating glass pill
  const pill = isHome && isScrolled;

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
        "fixed z-50 transition-all duration-500 ease-out",
        !isHome && "top-0 left-0 right-0 w-full border-b border-gray-100 bg-white",
        !isHome && isScrolled && "shadow-sm",
        isHome && !pill && "top-0 left-0 right-0 w-full border-b border-transparent",
        pill &&
          cn(
            "top-3 left-3 right-3 mx-auto max-w-6xl border border-white/15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]",
            mobileMenuOpen ? "rounded-3xl" : "rounded-full"
          )
      )}
    >
      {pill && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 bg-[#0a1a2d]/90 backdrop-blur-xl",
            mobileMenuOpen ? "rounded-3xl" : "rounded-full"
          )}
        />
      )}
      <nav className={cn("mx-auto flex h-16 w-full items-center justify-between px-5 md:px-8", !pill && "max-w-7xl")}>
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo width={120} height={48} showText={false} light={dark} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                dark
                  ? "hover:bg-white/10 hover:text-white " + (pathname === item.href ? "text-white" : "text-white/70")
                  : "hover:text-secondary " + (pathname === item.href ? "text-secondary font-semibold" : "text-foreground/70")
              )}
            >
              {item.name}
              {dark && pathname === item.href && (
                <span aria-hidden className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#7bb8e8] shadow-[0_0_10px_2px_rgba(123,184,232,0.9)]" />
              )}
            </Link>
          ))}

          {!sessionReady ? (
            <div className={cn("ml-4 h-9 w-24 animate-pulse rounded-full", dark ? "bg-white/10" : "bg-gray-100")} />
          ) : session ? (
            <div ref={loginRef} className={cn("relative border-l pl-4", dark ? "border-white/15" : "border-gray-200")}>
              <button
                onClick={() => setLoginOpen((v) => !v)}
                className={cn("flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3 text-sm font-semibold transition-colors", dark ? "hover:bg-white/10" : "hover:bg-gray-50")}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold" style={{ backgroundColor: session.color }}>
                  {initial}
                </span>
                <span className={cn("max-w-[120px] truncate", dark ? "text-white/90" : "text-foreground/80")}>{session.user.name || (session.role === "employer" ? "Employer" : session.role === "advertiser" ? "Advertiser" : "Job Seeker")}</span>
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
            <div className={cn("border-l pl-4", dark ? "border-white/15" : "border-gray-200")}>
              <Link
                href="/login"
                className={dark ? "cin-btn-glow inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#136BAB] to-[#3b82f6] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(59,130,246,0.8)] transition-transform hover:-translate-y-0.5" : "flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90 bg-secondary"}
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className={cn("md:hidden -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors", dark ? "text-white hover:bg-white/10" : "text-foreground/70 hover:bg-gray-100")}
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
        <div className={cn("md:hidden border-t", dark ? "border-white/10 bg-[#0a1a2d] rounded-b-3xl" : "border-gray-100 bg-white")}>
          <div className="container py-4 space-y-1 px-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-4 py-3 text-base font-medium rounded-2xl transition-colors",
                  dark
                    ? pathname === item.href
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                    : pathname === item.href
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
                    <p className={cn("text-sm font-semibold truncate", dark ? "text-white" : "text-foreground")}>{session.user.name || "—"}</p>
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
                <p className={cn("px-4 pb-2 text-xs font-semibold uppercase tracking-wider", dark ? "text-white/50" : "text-foreground/40")}>Login</p>
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
