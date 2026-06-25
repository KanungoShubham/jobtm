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
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

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
    "w-full px-4 py-3 rounded-2xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all placeholder:text-muted-foreground/50";

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
              <HiChat className="h-4 w-4" /> We&apos;d love to hear from you
            </span>
            <h1 className="font-heading text-5xl font-bold sm:text-6xl md:text-7xl mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
              Have a question or ready to start a project? Reach out and let&apos;s
              discuss how we can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {[
                { icon: HiMail, label: "infomnt01@gmail.com" },
                { icon: HiPhone, label: "+91 9669099914" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-5 py-2 text-sm font-medium">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-5 max-w-6xl mx-auto">

            {/* Form - wider column */}
            <ScrollReveal animation="fade-right" className="lg:col-span-3">
              <div className="rounded-3xl border border-border/50 bg-white shadow-warm-lg p-8 md:p-10">
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary/60 mb-2 block">
                    Send a Message
                  </span>
                  <h2 className="font-heading text-2xl font-bold">
                    We&apos;ll get back to you within 24 hours
                  </h2>
                </div>

                {submitted && (
                  <div className="mb-6 flex items-center gap-3 p-4 bg-secondary/10 border border-secondary/20 rounded-2xl text-secondary">
                    <HiCheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Message sent! We&apos;ll get back to you soon.</span>
                  </div>
                )}
                {apiError && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
                    {apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold mb-2">Full Name</label>
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
                      <label htmlFor="phone" className="block text-sm font-semibold mb-2">Phone Number</label>
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
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">Email Address</label>
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
                    <label htmlFor="subject" className="block text-sm font-semibold mb-2">Subject</label>
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
                    <label htmlFor="message" className="block text-sm font-semibold mb-2">Message</label>
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

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-warm"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <HiArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </ScrollReveal>

            {/* Info panel */}
            <ScrollReveal animation="fade-left" delay={150} className="lg:col-span-2">
              <div className="space-y-4">
                {/* Contact cards */}
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={info.title}
                      className="flex gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-secondary/25 hover:shadow-warm transition-all duration-300 group"
                    >
                      <div className="flex-shrink-0 h-11 w-11 rounded-2xl bg-secondary/10 group-hover:bg-secondary/20 flex items-center justify-center transition-colors">
                        <Icon className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-secondary/50 mb-0.5">
                          {info.title}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            target={info.href.startsWith("http") ? "_blank" : undefined}
                            rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-sm font-semibold hover:text-secondary transition-colors truncate block"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold">{info.value}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">{info.desc}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Business Hours */}
                <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <HiClock className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-sm font-bold">Business Hours</span>
                  </div>
                  <div className="space-y-2.5">
                    {hours.map(({ day, time }) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{day}</span>
                        <span className={`text-xs font-semibold ${time === "Closed" ? "text-destructive/70" : "text-secondary"}`}>
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
