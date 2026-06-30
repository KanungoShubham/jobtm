import Link from "next/link";
import {
  HiDocumentText,
  HiShieldCheck,
  HiBriefcase,
  HiUsers,
  HiLockClosed,
  HiBan,
  HiScale,
  HiRefresh,
  HiMail,
  HiChevronRight,
} from "react-icons/hi";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const sections = [
  { id: "acceptance",      label: "Acceptance of Terms" },
  { id: "eligibility",     label: "Eligibility" },
  { id: "accounts",        label: "User Accounts" },
  { id: "jobseeker",       label: "Job Seeker Terms" },
  { id: "employer",        label: "Employer Terms" },
  { id: "rewards",         label: "Rewards Program" },
  { id: "prohibited",      label: "Prohibited Conduct" },
  { id: "intellectual",    label: "Intellectual Property" },
  { id: "liability",       label: "Limitation of Liability" },
  { id: "termination",     label: "Termination" },
  { id: "governing-law",   label: "Governing Law" },
  { id: "contact",         label: "Contact Us" },
];

export const metadata = {
  title: "Terms & Conditions — JobsTM",
  description:
    "Read the Terms and Conditions governing your use of the JobsTM platform.",
};

export default function TermsPage() {
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
              <HiDocumentText className="h-4 w-4" /> Legal
            </span>
            <h1 className="font-heading text-5xl font-bold sm:text-6xl md:text-7xl mb-6 leading-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using the JobsTM platform.
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
                    href="/privacy"
                    className="flex items-center gap-1 text-xs text-secondary hover:underline font-semibold"
                  >
                    <HiLockClosed className="h-3.5 w-3.5" />
                    Privacy Policy
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
                    These Terms and Conditions ("Terms") govern your use of the JobsTM mobile application and
                    website ("Platform") operated by <strong>Maikal and Taksharya Pvt Limited</strong>. By
                    accessing or using JobsTM, you agree to be bound by these Terms. If you disagree with any
                    part of these Terms, you may not use our Platform.
                  </p>
                </div>
              </ScrollReveal>

              {/* 01 */}
              <ScrollReveal animation="fade-up" id="acceptance">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">01</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Acceptance of Terms</h2>
                <p className="text-sm text-muted-foreground">
                  By downloading, installing, or using the JobsTM app, you confirm that you have read,
                  understood, and agree to be bound by these Terms and our{" "}
                  <Link href="/privacy" className="text-secondary hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                  . These Terms constitute a legally binding agreement between you and Maikal and Taksharya
                  Pvt Limited.
                </p>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 02 */}
              <ScrollReveal animation="fade-up" id="eligibility">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">02</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Eligibility</h2>
                <p className="text-sm text-muted-foreground mb-3">To use JobsTM, you must:</p>
                <ul className="space-y-2">
                  {[
                    "Be at least 16 years of age",
                    "Have the legal capacity to enter into a binding agreement",
                    "Not be prohibited from using the Platform under applicable law",
                    "Provide accurate and truthful information during registration",
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
              <ScrollReveal animation="fade-up" id="accounts">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">03</span>
                <h2 className="font-heading text-2xl font-bold mb-4">User Accounts</h2>
                <div className="space-y-3">
                  {[
                    { title: "Registration", desc: "You must provide accurate, current, and complete information when creating an account." },
                    { title: "Account Security", desc: "You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account." },
                    { title: "One Account", desc: "Each user may maintain only one account. Creating duplicate accounts may result in suspension." },
                    { title: "Account Updates", desc: "You must promptly update your account information if it changes." },
                  ].map(({ title, desc }) => (
                    <div key={title} className="rounded-xl border border-border/50 bg-card p-4">
                      <p className="text-sm font-semibold mb-1">{title}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 04 */}
              <ScrollReveal animation="fade-up" id="jobseeker">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">04</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Job Seeker Terms</h2>
                <div className="flex gap-3 rounded-xl border border-border/50 bg-card p-4 mb-4">
                  <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <HiUsers className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">For Job Seekers</p>
                    <p className="text-xs text-muted-foreground">
                      As a job seeker, you agree to provide truthful information in your profile, including
                      qualifications, work experience, and skills. Misrepresentation may result in immediate
                      account termination.
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {[
                    "Your profile and resume may be shared with employers when you apply for a job",
                    "You must not apply for jobs you are not genuinely interested in",
                    "You are responsible for the accuracy of your profile information",
                    "JobsTM does not guarantee employment as a result of using the Platform",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-secondary mt-1">·</span>{item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 05 */}
              <ScrollReveal animation="fade-up" id="employer">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">05</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Employer Terms</h2>
                <div className="flex gap-3 rounded-xl border border-border/50 bg-card p-4 mb-4">
                  <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <HiBriefcase className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">For Employers</p>
                    <p className="text-xs text-muted-foreground">
                      As an employer, you agree to post only genuine job opportunities and to use candidate
                      information solely for recruitment purposes related to the posted position.
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {[
                    "Job postings must be accurate, legal, and not discriminatory",
                    "Candidate data may only be used for the specific recruitment purpose",
                    "Employers must not contact candidates for purposes unrelated to the job posting",
                    "JobsTM reserves the right to remove any job posting that violates these Terms",
                    "Employers are responsible for compliance with all applicable employment laws",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-secondary mt-1">·</span>{item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 06 */}
              <ScrollReveal animation="fade-up" id="rewards">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">06</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Rewards Program</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  JobsTM offers a rewards program for eligible job seekers. By participating, you agree that:
                </p>
                <ul className="space-y-2">
                  {[
                    "Rewards points are earned through qualifying activities as defined by JobsTM",
                    "Points have no monetary value and cannot be exchanged for cash",
                    "JobsTM reserves the right to modify, suspend, or terminate the rewards program at any time",
                    "Fraudulent activity to earn rewards will result in immediate account termination",
                    "Rewards points may expire as specified in the app",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-secondary mt-1">·</span>{item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 07 */}
              <ScrollReveal animation="fade-up" id="prohibited">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">07</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Prohibited Conduct</h2>
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 mb-4 text-sm text-destructive font-semibold">
                  Violation of these prohibitions may result in immediate account suspension.
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Post false, misleading, or fraudulent information",
                    "Harass, threaten, or intimidate other users",
                    "Collect or harvest user data without consent",
                    "Attempt to gain unauthorized access to the Platform",
                    "Use the Platform for any illegal purpose",
                    "Create fake job postings or fake profiles",
                    "Spam or send unsolicited messages to users",
                    "Reverse engineer or copy the Platform",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 rounded-xl border border-border/50 bg-card p-3">
                      <HiBan className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 08 */}
              <ScrollReveal animation="fade-up" id="intellectual">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">08</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Intellectual Property</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  All content on the JobsTM Platform — including the logo, design, text, graphics, and software
                  — is the property of Maikal and Taksharya Pvt Limited and is protected by applicable intellectual
                  property laws.
                </p>
                <p className="text-sm text-muted-foreground">
                  You retain ownership of content you submit (such as your resume and profile). By submitting
                  content, you grant JobsTM a non-exclusive, royalty-free license to display and use that content
                  to operate the Platform.
                </p>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 09 */}
              <ScrollReveal animation="fade-up" id="liability">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">09</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Limitation of Liability</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  To the maximum extent permitted by law, JobsTM and its officers, directors, and employees
                  shall not be liable for:
                </p>
                <ul className="space-y-2">
                  {[
                    "Any indirect, incidental, or consequential damages arising from your use of the Platform",
                    "Loss of employment opportunities or earnings",
                    "Accuracy or completeness of job postings or employer information",
                    "Actions taken by employers or job seekers based on Platform interactions",
                    "Service interruptions or technical failures",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <HiScale className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 10 */}
              <ScrollReveal animation="fade-up" id="termination">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">10</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Termination</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  JobsTM may suspend or terminate your account at any time, with or without notice, for:
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "Violation of these Terms",
                    "Fraudulent or illegal activity",
                    "Conduct harmful to other users or the Platform",
                    "Extended inactivity",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-secondary mt-1">·</span>{item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground">
                  You may delete your account at any time through the app settings. Upon termination, your
                  access to the Platform will cease and your data will be handled per our{" "}
                  <Link href="/privacy" className="text-secondary hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 11 */}
              <ScrollReveal animation="fade-up" id="governing-law">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">11</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Governing Law</h2>
                <p className="text-sm text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of India. Any
                  disputes arising from these Terms or your use of the Platform shall be subject to the exclusive
                  jurisdiction of the courts of <strong>Khandwa, Madhya Pradesh, India</strong>.
                </p>
              </ScrollReveal>

              <hr className="border-border/50" />

              {/* 12 */}
              <ScrollReveal animation="fade-up" id="contact">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">12</span>
                <h2 className="font-heading text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: HiMail,         label: "Email",    value: "support@jobstm.co",            href: "mailto:support@jobstm.co" },
                    { icon: HiDocumentText, label: "Privacy",  value: "Read our Privacy Policy",      href: "/privacy" },
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
                <div className="mt-4 rounded-xl border border-border/50 bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Maikal and Taksharya Pvt Limited</strong><br />
                    03 Friends Colony, Punjab Colony, Mata Chowk<br />
                    Khandwa, Madhya Pradesh 450001, India
                  </p>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
