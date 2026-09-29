"use client";

import * as React from "react";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiGlobe,
  HiCheckCircle,
  HiClock,
  HiArrowRight,
  HiChat,
} from "react-icons/hi";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PageHero, glassBadge } from "@/components/cinematic/PageHero";
import { WaveTop } from "@/components/cinematic/WaveTop";

const contactInfo = [
  {
    icon: HiMail,
    title: "Email Us",
    value: "infomnt01@gmail.com",
    href: "mailto:infomnt01@gmail.com",
    desc: "We reply within 24 hours",
  },
  {
    icon: HiPhone,
    title: "Call Us",
    value: "+91 9669099914",
    href: "tel:+919669099914",
    desc: "Mon–Fri, 9 AM – 6 PM IST",
  },
  {
    icon: HiGlobe,
    title: "Website",
    value: "jobstm.co",
    href: "https://jobstm.co",
    desc: "Visit our platform",
  },
  {
    icon: HiLocationMarker,
    title: "Visit Us",
    value: "Khandwa, MP 450001",
    href: null,
    desc: "03 Friends Colony, Punjab Colony, Mata Chowk",
  },
];

const hours = [
  { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
  { day: "Saturday", time: "10:00 AM – 4:00 PM" },
  { day: "Sunday", time: "Closed" },
];

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) newErrors.phone = "Phone number is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          setSubmitted(true);
          setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
          setTimeout(() => setSubmitted(false), 5000);
        } else {
          setApiError(data.error || "Failed to send message. Please try again.");
        }
      } catch {
        setApiError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-2xl border border-secondary/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all placeholder:text-muted-foreground/50";

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <PageHero
        badges={
          <span className={glassBadge}>
            <HiChat className="h-4 w-4" /> We&apos;d love to hear from you
          </span>
        }
        title={["Get in"]}
        accent={["Touch"]}
        description="Have a question or ready to start a project? Reach out and let's discuss how we can help."
      >
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: HiMail, label: "infomnt01@gmail.com" },
            { icon: HiPhone, label: "+91 9669099914" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="cin-glass cin-glass-hover inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium">
              <Icon className="h-4 w-4 text-[#7bb8e8]" />
              {label}
            </div>
          ))}
        </div>
      </PageHero>

      {/* Main Content */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "#f3f7ff" }}>
        <WaveTop fill="#060f1c" />
        <div aria-hidden className="pointer-events-none absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-40 bottom-10 h-[380px] w-[380px] rounded-full bg-secondary/10 blur-3xl" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-6 md:px-10">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Form - wider column */}
            <ScrollReveal animation="fade-up" className="lg:col-span-3">
              <div className="rounded-3xl border border-secondary/10 bg-white p-8 shadow-[0_30px_80px_-30px_rgba(19,107,171,0.4)] md:p-10">
                <div className="mb-8">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-secondary/60">
                    Send a Message
                  </span>
                  <h2 className="font-heading text-2xl font-bold">
                    We&apos;ll get back to you within 24 hours
                  </h2>
                </div>

                {submitted && (
                  <div className="mb-6 flex items-center gap-3 rounded-2xl border border-secondary/20 bg-secondary/10 p-4 text-secondary">
                    <HiCheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Message sent! We&apos;ll get back to you soon.</span>
                  </div>
                )}
                {apiError && (
                  <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                    {apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-semibold">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={inputClass}
                      />
                      {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-semibold">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={inputClass}
                      />
                      {errors.phone && <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-semibold">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className={inputClass}
                    />
                    {errors.subject && <p className="mt-1.5 text-xs text-destructive">{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-semibold">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us more about your project or question..."
                      className={`${inputClass} resize-none`}
                    />
                    {errors.message && <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#136BAB] to-[#3b82f6] px-8 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgba(59,130,246,0.6)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </ScrollReveal>

            {/* Info panel */}
            <ScrollReveal animation="fade-up" delay={150} className="lg:col-span-2">
              <div className="space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={info.title}
                      className="cin-card cin-glow-border group flex gap-4 rounded-2xl border border-secondary/10 bg-white p-5"
                    >
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#136BAB] to-[#3b82f6] shadow-[0_8px_20px_-8px_rgba(59,130,246,0.8)]">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-secondary/60">
                          {info.title}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            target={info.href.startsWith("http") ? "_blank" : undefined}
                            rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="block truncate text-sm font-semibold transition-colors hover:text-secondary"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold">{info.value}</p>
                        )}
                        <p className="mt-0.5 text-xs text-muted-foreground">{info.desc}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Business Hours */}
                <div className="rounded-2xl bg-gradient-to-br from-[#0d1f35] to-[#136BAB] p-5 text-white shadow-[0_30px_60px_-24px_rgba(19,107,171,0.7)]">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15">
                      <HiClock className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold">Business Hours</span>
                  </div>
                  <div className="space-y-2.5">
                    {hours.map(({ day, time }) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-xs text-white/65">{day}</span>
                        <span className={`text-xs font-semibold ${time === "Closed" ? "text-white/50" : "text-[#bfe0ff]"}`}>
                          {time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
