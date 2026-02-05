import Link from "next/link";
import { HiMail, HiPhone, HiGlobe, HiHeart } from "react-icons/hi";
import { Logo } from "./ui/Logo";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
  { name: "Marketing Materials", href: "/marketing-materials" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 px-6 md:px-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Link href="/" className="inline-flex items-center">
                <Logo width={100} height={100} showText={false} />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              <span className="font-heading text-lg font-bold text-foreground">Jobstm</span>
            </p>
            <p className="text-sm text-muted-foreground">
              A secure, verification-first gig hiring platform connecting qualified gig workers and students with trusted companies. By Maikal and Taksharya Pvt Limited.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold">
              Contact Info
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <HiMail className="h-4 w-4 flex-shrink-0" />
                <a
                  href="mailto:infomnt01@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  infomnt01@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <HiPhone className="h-4 w-4 flex-shrink-0" />
                <a
                  href="tel:+919669099914"
                  className="hover:text-primary transition-colors"
                >
                  +91 9669099914
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <HiGlobe className="h-4 w-4 flex-shrink-0" />
                <a
                  href="https://jobstm.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  jobstm.co
                </a>
              </div>
              <p className="text-muted-foreground pt-2">
                03 Friends Colony, Punjab Colony, Mata Chowk, Khandwa, MP 450001, India
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span>© 2026 Jobstm. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Built with <HiHeart className="h-4 w-4 fill-primary text-primary" /> by{" "}
              <a
                href="https://shubhamkanungo.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline transition-colors"
              >
                Shubham Kanungo
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
