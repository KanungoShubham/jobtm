import Link from "next/link";
import { HiMail, HiPhone, HiGlobe, HiLocationMarker } from "react-icons/hi";
import { Logo } from "./ui/Logo";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

const services = [
  { name: "Vocational Training", href: "/services" },
  { name: "Manpower Hiring", href: "/services" },
  { name: "Promotion Activities", href: "/services" },
  { name: "Upskill & Grow", href: "/services" },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#0d1f35", color: "#ffffff" }}>
      <div className="container py-16 px-6 md:px-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex mb-5">
              <Logo width={110} height={44} showText={false} />
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#8faec8" }}>
              A secure, verification-first gig hiring platform connecting qualified
              workers with trusted companies. By Maikal and Taksharya Pvt Limited.
            </p>
            <div className="flex gap-3">
              {["M", "T"].map((letter) => (
                <div
                  key={letter}
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold cursor-pointer transition-colors hover:bg-secondary"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#5a7a96" }}>
              Navigation
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#8faec8" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#5a7a96" }}>
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.name}>
                  <Link
                    href={s.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#8faec8" }}
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#5a7a96" }}>
              Contact
            </h3>
            <div className="space-y-3">
              <a href="mailto:infomnt01@gmail.com" className="flex items-center gap-2.5 text-sm transition-colors hover:text-white" style={{ color: "#8faec8" }}>
                <HiMail className="h-4 w-4 flex-shrink-0 text-secondary" />
                infomnt01@gmail.com
              </a>
              <a href="tel:+919669099914" className="flex items-center gap-2.5 text-sm transition-colors hover:text-white" style={{ color: "#8faec8" }}>
                <HiPhone className="h-4 w-4 flex-shrink-0 text-secondary" />
                +91 9669099914
              </a>
              <a href="https://jobstm.co" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm transition-colors hover:text-white" style={{ color: "#8faec8" }}>
                <HiGlobe className="h-4 w-4 flex-shrink-0 text-secondary" />
                jobstm.co
              </a>
              <div className="flex items-start gap-2.5 text-sm" style={{ color: "#8faec8" }}>
                <HiLocationMarker className="h-4 w-4 flex-shrink-0 text-secondary mt-0.5" />
                <span>03 Friends Colony, Punjab Colony,<br />Khandwa, MP 450001, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container px-6 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#4a6680" }}>
            © 2026 Jobstm · Maikal and Taksharya Pvt Limited · All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#4a6680" }}>
            Khandwa, Madhya Pradesh, India
          </p>
        </div>
      </div>
    </footer>
  );
}
