import Link from "next/link";
import {
  HiLockClosed,
  HiShieldCheck,
  HiUser,
  HiDatabase,
  HiEye,
  HiTrash,
  HiGlobe,
  HiMail,
  HiDocumentText,
  HiChevronRight,
} from "react-icons/hi";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const sections = [
  { id: "information-we-collect",    label: "Information We Collect" },
  { id: "how-we-use",               label: "How We Use Your Information" },
  { id: "information-sharing",      label: "Information Sharing" },
  { id: "data-storage",             label: "Data Storage & Security" },
  { id: "your-rights",              label: "Your Rights" },
  { id: "cookies",                  label: "Cookies & Tracking" },
  { id: "childrens-privacy",        label: "Children's Privacy" },
  { id: "third-party",              label: "Third-Party Links" },
  { id: "changes",                  label: "Changes to This Policy" },
  { id: "contact",                  label: "Contact Us" },
];

export const metadata = {
  title: "Privacy Policy — JobsTM",
  description:
    "Learn how JobsTM collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative bg-secondary text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/3 -right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/3 -left-1/4 w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold mb-6">
              <HiLockClosed className="h-4 w-4" /> Legal &amp; Privacy
            </span>
            <h1 className="font-heading text-5xl font-bold sm:text-6xl md:text-7xl mb-6 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
              We are committed to protecting your personal information and your
              right to privacy.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-5 py-2 text-sm font-medium">
                Last updated: 30 June 2026
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-5 py-2 text-sm font-medium">
                <HiShieldCheck className="h-4 w-4" /> Effective immediately
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[220px_1fr] items-start">

            {/* Sticky TOC */}
            <aside className="hidden lg:block sticky top-24">
              <div className="rounded-2xl border border-border/50 bg-muted/30 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Contents
                </p>
                <nav className="flex flex-col gap-1">
                  {sections.map((s, i) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-secondary transition-colors py-1"
                    >
                      <span className="text-secondary/50 font-bold tabular-nums w-5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-5 pt-4 border-t border-border/50">
                  <Link
                    href="/terms"
                    className="flex items-center gap-1 text-xs text-secondary hover:underline font-semibold"
                  >
                    <HiDocumentText className="h-3.5 w-3.5" />
                    Terms &amp; Conditions
                    <HiChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0 space-y-12">

              {/* Intro box */}
              <ScrollReveal animation="fade-up">
                <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-6">
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    <strong>Welcome to JobsTM.</strong> This Privacy Policy explains how
                    JobsTM ("we", "us", or "our") collects, uses, and protects your
                    information when you use our mobile application and related services.
                    By using JobsTM, you agree to the practices described in this policy.
                  </p>
                </div>
              </ScrollReveal>

              {/* 01 */}
              <ScrollReveal animation="fade-up" id="information-we-collect">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">01</span>
                  <h2 className="font-heading text-2xl font-bold mb-4">Information We Collect</h2>
                  <p className="text-muted-foreground mb-4">We collect information you provide directly and information generated through your use of the app:</p>

                  <div className="grid gap-4 sm:grid-cols-3 mb-4">
                    {[
                      {
                        icon: HiUser,
                        title: "Profile Information",
                        items: ["Full name, email, phone", "Profile photo, date of birth", "Educational qualifications", "Work experience & skills", "Resume / CV documents"],
                      },
                      {
                        icon: HiDatabase,
                        title: "Employer Information",
                        items: ["Company name & industry", "Location & contact details", "Job postings & hiring activity", "Application responses"],
                      },
                      {
                        icon: HiEye,
                        title: "Usage Information",
                        items: ["Job searches & applications", "Device model & OS version", "IP address & location", "App usage patterns"],
                      },
                    ].map(({ icon: Icon, title, items }) => (
                      <div key={title} className="rounded-2xl border border-border/50 bg-card p-4">
                        <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center mb-3">
                          <Icon className="h-4 w-4 text-secondary" />
                        </div>
                        <h3 className="font-semibold text-sm mb-2">{title}</h3>
                        <ul className="space-y-1">
                          {items.map((item) => (
                            <li key={item} className="text-xs text-muted-foreground flex gap-1.5">
                              <span className="text-secondary mt-0.5">·</span>{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 02 */}
              <ScrollReveal animation="fade-up" id="how-we-use">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">02</span>
                <h2 className="font-heading text-2xl font-bold mb-4">How We Use Your Information</h2>
                <ul className="space-y-3">
                  {[
                    "Match job seekers with relevant job opportunities",
                    "Allow employers to find and contact suitable candidates",
                    "Process job applications and track application status",
                    "Calculate and award rewards points to eligible users",
                    "Send notifications about new jobs, application updates, and rewards",
                    "Improve our platform, features, and user experience",
                    "Prevent fraud and ensure the security of our platform",
                    "Comply with applicable Indian laws and regulations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="h-5 w-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <HiShieldCheck className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 03 */}
              <ScrollReveal animation="fade-up" id="information-sharing">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">03</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Information Sharing</h2>
                <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-4 mb-4 text-sm text-secondary font-semibold">
                  We do <strong>not sell</strong> your personal information to any third party.
                </div>
                <div className="space-y-3">
                  {[
                    { label: "With Employers", desc: "When you apply for a job, your profile and application details are shared with the relevant employer." },
                    { label: "With Job Seekers", desc: "Employers' company profiles and job postings are visible to job seekers on the platform." },
                    { label: "Service Providers", desc: "Trusted third parties who help us operate our app (cloud hosting, analytics), bound by confidentiality agreements." },
                    { label: "Legal Requirements", desc: "When required by law, court order, or governmental authority in India." },
                    { label: "Business Transfers", desc: "In connection with a merger, acquisition, or sale of assets, with appropriate notice to users." },
                  ].map(({ label, desc }) => (
                    <div key={label} className="rounded-xl border border-border/50 bg-card p-4">
                      <p className="text-sm font-semibold mb-1">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 04 */}
              <ScrollReveal animation="fade-up" id="data-storage">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">04</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Data Storage &amp; Security</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Your data is stored on secure servers. We implement industry-standard security measures including
                  encryption, access controls, and regular security reviews.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  We retain your data for as long as your account is active. If you delete your account, we will
                  delete your personal data within <strong>30 days</strong>, except where retention is required by law.
                </p>
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 text-xs text-muted-foreground">
                  While we take all reasonable steps to protect your data, no method of transmission over the internet
                  is 100% secure. Please protect your account credentials and notify us immediately if you suspect
                  unauthorized access.
                </div>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 05 */}
              <ScrollReveal animation="fade-up" id="your-rights">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">05</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Your Rights</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: HiEye,       title: "Access",           desc: "Request a copy of the personal data we hold about you." },
                    { icon: HiUser,      title: "Correction",       desc: "Update or correct inaccurate information via your profile settings." },
                    { icon: HiTrash,     title: "Deletion",         desc: "Request deletion of your account and personal data." },
                    { icon: HiDatabase,  title: "Portability",      desc: "Request your data in a machine-readable format." },
                    { icon: HiShieldCheck, title: "Withdraw Consent", desc: "Opt out of non-essential communications at any time." },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-3 rounded-xl border border-border/50 bg-card p-4">
                      <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  To exercise these rights, contact us at{" "}
                  <a href="mailto:support@jobstm.co" className="text-secondary font-semibold hover:underline">
                    support@jobstm.co
                  </a>
                </p>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 06 */}
              <ScrollReveal animation="fade-up" id="cookies">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">06</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Cookies &amp; Tracking</h2>
                <p className="text-sm text-muted-foreground">
                  Our mobile app may use device identifiers and similar technologies to enhance your experience,
                  remember your preferences, and analyze usage patterns. We do not use third-party advertising
                  tracking technologies.
                </p>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 07 */}
              <ScrollReveal animation="fade-up" id="childrens-privacy">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">07</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Children&apos;s Privacy</h2>
                <p className="text-sm text-muted-foreground">
                  JobsTM is intended for users aged <strong>16 years and older</strong>. We do not knowingly collect
                  personal information from children under 16. If we become aware that a child under 16 has provided
                  us with personal data, we will promptly delete such information.
                </p>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 08 */}
              <ScrollReveal animation="fade-up" id="third-party">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">08</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Third-Party Links</h2>
                <p className="text-sm text-muted-foreground">
                  Our app may contain links to third-party websites or services. We are not responsible for the privacy
                  practices of those third parties. We encourage you to review their privacy policies before providing
                  any personal information.
                </p>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 09 */}
              <ScrollReveal animation="fade-up" id="changes">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">09</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Changes to This Policy</h2>
                <p className="text-sm text-muted-foreground">
                  We may update this Privacy Policy periodically to reflect changes in our practices or for legal,
                  operational, or regulatory reasons. We will notify you of significant changes via the app or email.
                  Continued use of JobsTM after changes constitutes acceptance of the updated policy.
                </p>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 10 */}
              <ScrollReveal animation="fade-up" id="contact">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">10</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data,
                  please contact us:
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: HiMail,  label: "Email",   value: "support@jobstm.co",  href: "mailto:support@jobstm.co" },
                    { icon: HiGlobe, label: "Website", value: "jobstm.co",          href: "https://jobstm.co" },
                    { icon: HiDocumentText, label: "Terms", value: "Terms & Conditions", href: "/terms" },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex gap-3 rounded-xl border border-border/50 bg-card p-4 hover:border-secondary/30 hover:shadow-warm transition-all group"
                    >
                      <div className="h-9 w-9 rounded-xl bg-secondary/10 group-hover:bg-secondary/20 flex items-center justify-center shrink-0 transition-colors">
                        <Icon className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-semibold">{value}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  We aim to respond to all privacy-related inquiries within 7 business days.
                </p>
              </ScrollReveal>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
