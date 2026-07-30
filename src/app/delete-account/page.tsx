import {
  HiLockClosed,
  HiShieldCheck,
  HiMail,
  HiUser,
  HiTrash,
  HiClock,
  HiExclamationCircle,
} from "react-icons/hi";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = {
  title: "Delete Your Account — JobsTM",
  description:
    "How to request deletion of your JobsTM account and associated personal data.",
};

export default function DeleteAccountPage() {
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
              <HiLockClosed className="h-4 w-4" /> Account &amp; Data
            </span>
            <h1 className="font-heading text-5xl font-bold sm:text-6xl md:text-7xl mb-6 leading-tight">
              Delete Your Account
            </h1>
            <p className="text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
              JobsTM — how to permanently delete your account and personal data.
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-12">

            <ScrollReveal animation="fade-up">
              <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-6">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  You can request deletion of your JobsTM account and all associated personal data
                  at any time. Follow the steps below.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">01</span>
              <h2 className="font-heading text-2xl font-bold mb-4">How to Request Deletion</h2>
              <div className="space-y-3">
                {[
                  { step: "1", desc: "Send an email to support@jobstm.co from the email address (or with the mobile number) registered on your JobsTM account." },
                  { step: "2", desc: "Use the subject line \"Account Deletion Request\" and include your registered mobile number." },
                  { step: "3", desc: "We will verify your identity and process the deletion request within 7 business days." },
                  { step: "4", desc: "You'll receive a confirmation email once your account and data have been deleted." },
                ].map(({ step, desc }) => (
                  <div key={step} className="flex gap-4 rounded-xl border border-border/50 bg-card p-4">
                    <div className="h-7 w-7 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {step}
                    </div>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <a
                  href="mailto:support@jobstm.co?subject=Account%20Deletion%20Request"
                  className="inline-flex items-center gap-2 rounded-full bg-secondary text-white px-6 py-3 text-sm font-semibold hover:bg-secondary/90 transition-colors"
                >
                  <HiMail className="h-4 w-4" /> Email support@jobstm.co
                </a>
              </div>
            </ScrollReveal>

            <hr className="border-border/50" />

            <ScrollReveal animation="fade-up">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">02</span>
              <h2 className="font-heading text-2xl font-bold mb-4">What Gets Deleted</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: HiUser, title: "Profile data", desc: "Name, email, mobile number, photo, education, work experience, resumes." },
                  { icon: HiTrash, title: "Applications & activity", desc: "Job applications, saved jobs, ratings, and in-app activity history." },
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
            </ScrollReveal>

            <hr className="border-border/50" />

            <ScrollReveal animation="fade-up">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">03</span>
              <h2 className="font-heading text-2xl font-bold mb-4">What May Be Retained</h2>
              <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 flex gap-3">
                <HiExclamationCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Certain records — such as payment/transaction history and information required for legal,
                  tax, or fraud-prevention purposes — may be retained for a limited period as required by
                  applicable Indian law, even after your account is deleted. These records are not used for
                  any other purpose.
                </p>
              </div>
            </ScrollReveal>

            <hr className="border-border/50" />

            <ScrollReveal animation="fade-up">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">04</span>
              <h2 className="font-heading text-2xl font-bold mb-4">Timeline</h2>
              <div className="flex gap-3 rounded-xl border border-border/50 bg-card p-4">
                <HiClock className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Your account and personal data will be fully deleted within <strong>30 days</strong> of a
                  verified request, in line with our{" "}
                  <a href="/privacy" className="text-secondary font-semibold hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </ScrollReveal>

            <hr className="border-border/50" />

            <ScrollReveal animation="fade-up">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">05</span>
              <h2 className="font-heading text-2xl font-bold mb-4">Questions?</h2>
              <p className="text-sm text-muted-foreground">
                If you have any questions about this process, contact us at{" "}
                <a href="mailto:support@jobstm.co" className="text-secondary font-semibold hover:underline">
                  support@jobstm.co
                </a>
                . We aim to respond within 7 business days.
              </p>
            </ScrollReveal>

          </div>
        </div>
      </section>

    </div>
  );
}
