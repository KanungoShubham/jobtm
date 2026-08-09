"use client";

import * as React from "react";
import {
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineUpload,
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineClipboardCopy,
  HiOutlineBadgeCheck,
} from "react-icons/hi";
import { HiOutlineUsers, HiOutlineTrophy } from "react-icons/hi2";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* -----------------------------------------------------------------------
 * MOCK PAGE — UI ONLY
 * Fields below mirror the client's existing Google Form exactly. No
 * backend / API calls are wired up yet. On final submit the form just
 * shows a success screen with a locally generated mock registration ID.
 * Once the client approves the UI, this will be connected to a real API
 * that stores registration data in the database and payment/ID photos
 * in a dedicated uploads folder (see /public/payment-uploads/README.md).
 * --------------------------------------------------------------------- */

const MAROON = "#7a1030";

type Gender = "male" | "female" | "";
type GameOption = "traditional" | "artistic-pair" | "";

interface FormState {
  fullName: string;
  email: string;
  fatherName: string;
  contactNumber: string;
  dob: string;
  address: string;
  ageCategory: string;
  gameOption: GameOption;
  gender: Gender;
  passportPhoto: File | null;
  aadharPhoto: File | null;
  paymentId: string;
  paymentScreenshot: File | null;
  coachSchool: string;
  clubOrg: string;
  parentsDeclaration: string;
  medicalDeclaration: string;
}

const initialForm: FormState = {
  fullName: "",
  email: "",
  fatherName: "",
  contactNumber: "",
  dob: "",
  address: "",
  ageCategory: "",
  gameOption: "",
  gender: "",
  passportPhoto: null,
  aadharPhoto: null,
  paymentId: "",
  paymentScreenshot: null,
  coachSchool: "",
  clubOrg: "",
  parentsDeclaration: "",
  medicalDeclaration: "",
};

const ageCategories = [
  { id: "8-14", label: "8 to 14" },
  { id: "14-20", label: "14 to 20" },
  { id: "20+", label: "20+" },
];

const steps = ["Personal Details", "Category", "Documents", "Fees & Payment", "Coach & Declarations", "Review & Submit"];

function classNames(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export default function LakshyaManthanPage() {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState<FormState>(initialForm);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [previews, setPreviews] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [regId, setRegId] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFile = (key: "passportPhoto" | "aadharPhoto" | "paymentScreenshot", file: File | null) => {
    update(key, file);
    setPreviews((prev) => {
      const next = { ...prev };
      if (file) next[key] = URL.createObjectURL(file);
      else delete next[key];
      return next;
    });
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.fullName.trim()) e.fullName = "Name is required";
      if (!form.email.trim()) e.email = "Email ID is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email is invalid";
      if (!form.contactNumber.trim()) e.contactNumber = "Contact number / WhatsApp number is required";
      else if (!/^\+?[\d\s-()]{8,}$/.test(form.contactNumber)) e.contactNumber = "Enter a valid number";
      if (!form.dob) e.dob = "Date of birth is required";
      if (!form.address.trim()) e.address = "Address is required";
      if (!form.gender) e.gender = "Please select gender";
    }
    if (s === 1) {
      if (!form.ageCategory) e.ageCategory = "Select an age category";
      if (!form.gameOption) e.gameOption = "Select a game option";
    }
    if (s === 2) {
      if (!form.passportPhoto) e.passportPhoto = "Passport size photo is required";
      if (!form.aadharPhoto) e.aadharPhoto = "Aadhar ID photo is required";
    }
    if (s === 3) {
      if (!form.paymentId.trim()) e.paymentId = "Payment / transaction ID is required";
      if (!form.paymentScreenshot) e.paymentScreenshot = "Please upload proof of fee payment";
    }
    if (s === 4) {
      if (!form.coachSchool.trim()) e.coachSchool = "Coach name & school name is required";
      if (!form.parentsDeclaration.trim()) e.parentsDeclaration = "Please type your consent";
      if (!form.medicalDeclaration.trim()) e.medicalDeclaration = "Please type your declaration";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    if (!validateStep(4)) {
      setStep(4);
      return;
    }
    // MOCK submit — no API call yet.
    const id = `LM26-${Math.floor(1000 + Math.random() * 9000)}`;
    setRegId(id);
    setSubmitted(true);
  };

  const copyBank = () => {
    navigator.clipboard.writeText("004105022579");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--lm-maroon)]/30 focus:border-[color:var(--lm-maroon)] transition-all placeholder:text-black/30";

  return (
    <div className="overflow-x-hidden" style={{ ["--lm-maroon" as string]: MAROON }}>
      {/* HERO */}
      <section className="relative bg-[color:var(--lm-maroon)] text-white pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/3 -right-1/4 w-[600px] h-[600px] bg-amber-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
          <div className="absolute -bottom-1/3 -left-1/4 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-white/[0.03] rounded-full blur-3xl" />
        </div>

        {/* Floating decorative trophies */}
        <HiOutlineTrophy className="hidden md:block absolute top-16 left-[8%] h-10 w-10 text-amber-300/30 animate-float-slow" />
        <HiOutlineTrophy className="hidden md:block absolute bottom-24 right-[10%] h-8 w-8 text-amber-300/25 animate-float" />
        <HiOutlineBadgeCheck className="hidden md:block absolute top-1/3 right-[6%] h-9 w-9 text-emerald-300/25 animate-float-slow" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal animation="scale" duration={600}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/lakshya-manthan/lakshya-logo.png"
                alt="Lakshya Paryavaran Water Solution & Welfare Society"
                className="h-20 w-20 mx-auto mb-5 rounded-full bg-white p-1.5 shadow-lg animate-float-slow"
              />
            </ScrollReveal>

            <ScrollReveal animation="fade-down" delay={100}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-5 py-2 text-xs sm:text-sm font-semibold mb-6 tracking-wide">
                <HiOutlineTrophy className="h-4 w-4" /> Organized by Lakshya Water Solution &amp; Welfare Society
              </span>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-amber-300 font-semibold tracking-widest text-sm mb-2">लक्ष्य &lsquo;मंथन&rsquo;</p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <h1 className="font-heading text-4xl font-bold sm:text-5xl md:text-6xl mb-4 leading-tight bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
                Yogasana Championship 2026
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={400}>
              <p className="italic text-white/80 mb-8">&ldquo;Play Together, Win Together&rdquo;</p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={500}>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="#register"
                  className="group inline-flex items-center gap-2 rounded-full bg-amber-400 text-[color:var(--lm-maroon)] px-6 py-3 text-sm font-bold hover:bg-amber-300 hover:-translate-y-0.5 hover:shadow-xl transition-all shadow-lg"
                >
                  Register Now <HiOutlineArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#details"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-6 py-3 text-sm font-semibold hover:bg-white/20 hover:-translate-y-0.5 transition-all"
                >
                  Event Details
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={600}>
              <p className="text-xs text-white/60 mt-6">
                Supported by Government of Madhya Pradesh · Technically supported by MYSAI, Indore
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Poster showcase — floats across the hero/banner seam */}
        <ScrollReveal animation="zoom" delay={250} duration={800} className="relative z-10 mt-14 md:mt-16">
          <div className="container">
            <div className="max-w-4xl mx-auto group">
              <div className="relative rounded-3xl p-1.5 bg-gradient-to-br from-amber-300/60 via-white/20 to-emerald-300/40 shadow-2xl animate-card-float">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/lakshya-manthan/event-banner.jpg"
                  alt="Lakshya Manthan Yogasana Pratiyogita — स्वस्थ शरीर, स्वच्छ मन, सशक्त समाज"
                  className="w-full rounded-[1.3rem] shadow-warm-lg transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* spacer to absorb the poster's floating overlap on the next section */}
      <div className="h-6 md:h-8 bg-neutral-50" />

      {/* SCHEDULE + DETAILS */}
      <section id="details" className="py-16 md:py-24 bg-neutral-50">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
            {/* Schedule */}
            <div className="rounded-3xl border border-black/5 bg-white shadow-warm-lg p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <HiOutlineCalendar className="h-5 w-5 text-[color:var(--lm-maroon)]" />
                <h2 className="font-heading text-xl font-bold">Competition Schedule</h2>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Round 1 — Selection Round",
                    sub: "8+ to 14 Years · Boys & Girls",
                    ageNote: "Age calculated as on 31 December 2026",
                    years: "Eligible Birth Years: 01 Jan 2013 to 31 Dec 2018",
                    date: "Sunday, 30 August 2026",
                    venue: "St. Arnold Higher Secondary School, Scheme No. 74, Vijay Nagar, Indore",
                  },
                  {
                    title: "Round 1 — Selection Round",
                    sub: "14+ to 20 Years · Boys & Girls",
                    ageNote: "Age calculated as on 31 December 2026",
                    years: "Eligible Birth Years: 01 Jan 2007 to 31 Dec 2012",
                    date: "Sunday, 6 September 2026",
                    venue: "St. Arnold Higher Secondary School, Scheme No. 74, Vijay Nagar, Indore",
                  },
                  {
                    title: "Round 2 — Grand Finale",
                    sub: "Qualified Athletes from All Age Categories",
                    ageNote: "",
                    years: "",
                    date: "Saturday, 12 September 2026",
                    venue: "To be announced soon",
                  },
                ].map((r) => (
                  <div key={r.title + r.sub} className="flex gap-4 p-4 rounded-2xl bg-neutral-50 border border-black/5">
                    <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-[color:var(--lm-maroon)]/10 flex items-center justify-center">
                      <HiOutlineCalendar className="h-5 w-5 text-[color:var(--lm-maroon)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm">{r.title}</p>
                      <p className="text-xs text-black/50 mb-1">{r.sub}</p>
                      {r.ageNote && <p className="text-[11px] text-black/40">{r.ageNote}</p>}
                      {r.years && <p className="text-[11px] text-black/40 mb-1">{r.years}</p>}
                      <p className="text-xs font-semibold text-emerald-700">{r.date}</p>
                      <p className="text-xs text-black/50">Venue: {r.venue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="rounded-3xl border border-black/5 bg-white shadow-warm-lg p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <HiOutlineBadgeCheck className="h-5 w-5 text-emerald-700" />
                <h2 className="font-heading text-xl font-bold">Competition Details</h2>
              </div>
              <ul className="space-y-4 text-sm">
                <li>
                  <span className="font-bold">Events: </span>
                  Traditional Yogasana &amp; Artistic Pair Yogasana (Boys Pair &amp; Girls Pair)
                </li>
                <li>
                  <span className="font-bold">Age Rule: </span>
                  Calculated strictly as on 31 December 2026.
                </li>
                <li>
                  <span className="font-bold">Participation: </span>
                  Athletes may join both Traditional &amp; Artistic Pair categories. Mixed pairs are not permitted.
                </li>
                <li>
                  <span className="font-bold">Registration Mode: </span>
                  Registration is conducted online via this page.
                </li>
                <li>
                  <span className="font-bold">Registration Closing Date: </span>
                  24 August 2026
                </li>
                <li>
                  <span className="font-bold">Entry Fee: </span>
                  ₹100 / athlete
                </li>
              </ul>
            </div>
          </div>

          {/* Bank Details + Awards */}
          <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto mt-8">
            <div className="rounded-3xl border border-[color:var(--lm-maroon)]/15 bg-white shadow-warm-lg p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <HiOutlineCreditCard className="h-5 w-5 text-[color:var(--lm-maroon)]" />
                <h2 className="font-heading text-xl font-bold">Bank Details for Entry Fee Deposit</h2>
              </div>
              <dl className="text-sm space-y-2.5">
                <div className="flex justify-between gap-3">
                  <dt className="text-black/50">Account Name</dt>
                  <dd className="font-semibold text-right">Lakshya Paryavaran Water Solution &amp; Welfare Society</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-black/50">Account Number</dt>
                  <dd className="font-semibold">004105022579</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-black/50">IFSC Code</dt>
                  <dd className="font-semibold">ICIC0000041</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-black/50">Bank Name &amp; Branch</dt>
                  <dd className="font-semibold text-right">ICICI Bank, Indore Branch</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 shadow-warm-lg p-6 md:p-8 flex flex-col justify-center text-center">
              <HiOutlineTrophy className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h2 className="font-heading text-xl font-bold mb-2">Awards &amp; Recognition</h2>
              <p className="text-sm font-bold text-[color:var(--lm-maroon)]">
                Lot of Cash Prizes and Gifts for Winners
              </p>
              <p className="text-sm text-emerald-700 font-semibold mt-1">
                Medals and Certificate for all Participants
              </p>
            </div>
          </div>

          {/* Rules, Regulations & General Instructions */}
          <div className="max-w-6xl mx-auto mt-8">
            <div className="rounded-3xl border border-[color:var(--lm-maroon)]/15 bg-white shadow-warm-lg p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <HiOutlineBadgeCheck className="h-5 w-5 text-[color:var(--lm-maroon)]" />
                <h2 className="font-heading text-xl font-bold">Rules, Regulations &amp; General Instructions</h2>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 text-sm">
                <li>
                  <span className="font-bold">Reporting Time: </span>
                  All athletes must reach the venue in the morning sharp at 8:00 A.M.
                </li>
                <li>
                  <span className="font-bold">Dress Code: </span>
                  Proper Yogasana attire is mandatory. No loose t-shirts are allowed during performance; only proper skin-fit Yogasana attire is permitted.
                </li>
                <li>
                  <span className="font-bold">Appearance: </span>
                  Athletes must be neat with minimal / proper makeup (heavy makeup is strictly prohibited).
                </li>
                <li>
                  <span className="font-bold">Props: </span>
                  No props are allowed during the performance.
                </li>
                <li className="sm:col-span-2">
                  <span className="font-bold">Judges&apos; Decision &amp; Discipline: </span>
                  The decision of the judges will be final and binding for all participants. Compliance with the judges&apos; decision is mandatory. Any kind of dispute or misconduct raised against the judges by any athlete, coach, or parent will be strictly considered as indiscipline, and the concerned participant may face disqualification.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION */}
      <section id="register" className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--lm-maroon)]/70">
              Athlete Registration
            </span>
            <h2 className="font-heading text-3xl font-bold mt-2">Register for the Championship</h2>
            <p className="text-sm text-black/50 mt-2">
              This is a UI mock for client review — form data is not sent anywhere yet.
            </p>
          </div>

          <div className="max-w-3xl mx-auto rounded-3xl border border-black/5 bg-white shadow-warm-lg p-6 md:p-12">
            {submitted ? (
              <SuccessScreen regId={regId} onReset={() => {
                setSubmitted(false);
                setForm(initialForm);
                setPreviews({});
                setStep(0);
              }} />
            ) : (
              <>
                {/* Stepper */}
                <div className="flex items-center mb-10 overflow-x-auto">
                  {steps.map((label, i) => (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div
                          className={classNames(
                            "h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                            i < step
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : i === step
                              ? "border-[color:var(--lm-maroon)] text-[color:var(--lm-maroon)] bg-[color:var(--lm-maroon)]/5"
                              : "border-black/10 text-black/30"
                          )}
                        >
                          {i < step ? <HiOutlineCheckCircle className="h-5 w-5" /> : i + 1}
                        </div>
                        <span className={classNames("text-[10px] font-semibold text-center hidden sm:block whitespace-nowrap", i === step ? "text-[color:var(--lm-maroon)]" : "text-black/40")}>
                          {label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={classNames("h-0.5 flex-1 min-w-[16px] mx-2", i < step ? "bg-emerald-600" : "bg-black/10")} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Step 0: Personal Details */}
                {step === 0 && (
                  <div className="space-y-5">
                    <Field label="Name" required error={errors.fullName}>
                      <div className="relative">
                        <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                        <input className={inputClass + " pl-10"} placeholder="Your answer"
                          value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
                      </div>
                    </Field>

                    <Field label="Email ID" required error={errors.email}>
                      <div className="relative">
                        <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                        <input className={inputClass + " pl-10"} placeholder="Your answer"
                          value={form.email} onChange={(e) => update("email", e.target.value)} />
                      </div>
                    </Field>

                    <Field label="Father's Name">
                      <input className={inputClass} placeholder="Your answer"
                        value={form.fatherName} onChange={(e) => update("fatherName", e.target.value)} />
                    </Field>

                    <Field label="Contact Number / WhatsApp Number" required error={errors.contactNumber}>
                      <div className="relative">
                        <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                        <input className={inputClass + " pl-10"} placeholder="Your answer"
                          value={form.contactNumber} onChange={(e) => update("contactNumber", e.target.value)} />
                      </div>
                    </Field>

                    <Field label="Date of Birth" required error={errors.dob}>
                      <input type="date" className={inputClass} value={form.dob}
                        onChange={(e) => update("dob", e.target.value)} />
                    </Field>

                    <Field label="Address" required error={errors.address}>
                      <input className={inputClass} placeholder="Your answer"
                        value={form.address} onChange={(e) => update("address", e.target.value)} />
                    </Field>

                    <Field label="Gender" required error={errors.gender}>
                      <div className="flex gap-3">
                        {([
                          { id: "male", label: "Male" },
                          { id: "female", label: "Female" },
                        ] as { id: Gender; label: string }[]).map((g) => (
                          <button
                            type="button"
                            key={g.id}
                            onClick={() => update("gender", g.id)}
                            className={classNames(
                              "flex-1 py-3 rounded-xl border text-sm font-semibold transition-colors",
                              form.gender === g.id
                                ? "border-[color:var(--lm-maroon)] bg-[color:var(--lm-maroon)]/5 text-[color:var(--lm-maroon)]"
                                : "border-black/10 text-black/50 hover:border-black/20"
                            )}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                )}

                {/* Step 1: Category */}
                {step === 1 && (
                  <div className="space-y-6">
                    <Field label="Age Category" required error={errors.ageCategory}>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {ageCategories.map((c) => (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => update("ageCategory", c.id)}
                            className={classNames(
                              "text-center p-4 rounded-2xl border font-bold text-sm transition-colors",
                              form.ageCategory === c.id
                                ? "border-[color:var(--lm-maroon)] bg-[color:var(--lm-maroon)]/5 text-[color:var(--lm-maroon)]"
                                : "border-black/10 hover:border-black/20"
                            )}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Game Options" required error={errors.gameOption}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => update("gameOption", "traditional")}
                          className={classNames(
                            "flex items-center gap-3 p-4 rounded-2xl border transition-colors text-left",
                            form.gameOption === "traditional"
                              ? "border-[color:var(--lm-maroon)] bg-[color:var(--lm-maroon)]/5"
                              : "border-black/10 hover:border-black/20"
                          )}
                        >
                          <HiOutlineUser className="h-5 w-5 text-[color:var(--lm-maroon)] flex-shrink-0" />
                          <p className="font-bold text-sm">Traditional</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => update("gameOption", "artistic-pair")}
                          className={classNames(
                            "flex items-center gap-3 p-4 rounded-2xl border transition-colors text-left",
                            form.gameOption === "artistic-pair"
                              ? "border-[color:var(--lm-maroon)] bg-[color:var(--lm-maroon)]/5"
                              : "border-black/10 hover:border-black/20"
                          )}
                        >
                          <HiOutlineUsers className="h-5 w-5 text-[color:var(--lm-maroon)] flex-shrink-0" />
                          <p className="font-bold text-sm">Artistic Pair</p>
                        </button>
                      </div>
                    </Field>
                  </div>
                )}

                {/* Step 2: Documents */}
                {step === 2 && (
                  <div className="space-y-6">
                    <FileField
                      label="Passport Size Photo"
                      required
                      hint="Upload 1 supported file. Max 10 MB."
                      error={errors.passportPhoto}
                      file={form.passportPhoto}
                      preview={previews.passportPhoto}
                      onChange={(f) => handleFile("passportPhoto", f)}
                    />
                    <FileField
                      label="Aadhar ID Photo"
                      required
                      hint="Upload 1 supported file. Max 10 MB."
                      error={errors.aadharPhoto}
                      file={form.aadharPhoto}
                      preview={previews.aadharPhoto}
                      onChange={(f) => handleFile("aadharPhoto", f)}
                    />
                  </div>
                )}

                {/* Step 3: Fees & Payment */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-3">
                        Fees
                      </p>
                      <div className="grid gap-5 sm:grid-cols-[1fr_auto] items-start">
                        <dl className="text-sm space-y-1.5">
                          <div className="flex justify-between items-center gap-3">
                            <dt className="text-black/50">A/c No.</dt>
                            <dd className="font-semibold flex items-center gap-2">
                              004105022579
                              <button type="button" onClick={copyBank} className="text-emerald-700 hover:text-emerald-900">
                                <HiOutlineClipboardCopy className="h-4 w-4" />
                              </button>
                            </dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-black/50">A/c Name</dt>
                            <dd className="font-semibold text-right">Lakshya Paryavaran Water Solution and Welfare Society</dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-black/50">IFSC Code</dt>
                            <dd className="font-semibold">icic0000041</dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-black/50">Bank</dt>
                            <dd className="font-semibold">ICICI Bank, Indore Branch</dd>
                          </div>
                          <div className="flex justify-between gap-3 pt-1.5 border-t border-emerald-200/70 mt-1.5">
                            <dt className="text-black/50">Entry Fee</dt>
                            <dd className="font-bold text-emerald-700">₹100 / athlete</dd>
                          </div>
                        </dl>

                        {/* QR code (placeholder mock — swap in the real bank UPI QR image once provided) */}
                        <div className="flex flex-col items-center justify-self-center sm:justify-self-end">
                          <div className="h-32 w-32 rounded-xl border border-emerald-200 bg-white flex items-center justify-center overflow-hidden">
                            <MockQrCode />
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700 mt-1.5">Scan &amp; Pay with any UPI app</span>
                        </div>
                      </div>
                      {copied && <p className="text-[11px] text-emerald-700 mt-2">Account number copied</p>}
                    </div>

                    <Field label="Payment ID / Transaction ID" required error={errors.paymentId}>
                      <div className="relative">
                        <HiOutlineCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                        <input className={inputClass + " pl-10"} placeholder="e.g. UTR / UPI reference number"
                          value={form.paymentId} onChange={(e) => update("paymentId", e.target.value)} />
                      </div>
                    </Field>

                    <FileField
                      label="Payment Screenshot / Proof"
                      required
                      hint="Scan the QR / transfer using the details above, then upload the payment screenshot. PNG or JPG, up to 10 MB."
                      error={errors.paymentScreenshot}
                      file={form.paymentScreenshot}
                      preview={previews.paymentScreenshot}
                      onChange={(f) => handleFile("paymentScreenshot", f)}
                    />
                    <p className="text-[11px] text-black/35">
                      Screenshots will be stored in a dedicated payment-uploads folder, separate from registration records, once the API is connected.
                    </p>
                  </div>
                )}

                {/* Step 4: Coach & Declarations */}
                {step === 4 && (
                  <div className="space-y-5">
                    <Field label="Coach Name & School Name" required error={errors.coachSchool}>
                      <input className={inputClass} placeholder="Your answer"
                        value={form.coachSchool} onChange={(e) => update("coachSchool", e.target.value)} />
                    </Field>

                    <Field label="Club / Organization">
                      <input className={inputClass} placeholder="Your answer"
                        value={form.clubOrg} onChange={(e) => update("clubOrg", e.target.value)} />
                    </Field>

                    <Field
                      label="Parents Declaration"
                      required
                      error={errors.parentsDeclaration}
                      note="we (parents) do hereby declare that i give my full consent for my son/daughter to participate in this yogasana sports championship."
                    >
                      <input className={inputClass} placeholder="Your answer"
                        value={form.parentsDeclaration} onChange={(e) => update("parentsDeclaration", e.target.value)} />
                    </Field>

                    <Field
                      label="Medical Fitness Declaration"
                      required
                      error={errors.medicalDeclaration}
                      note="I declare that I am medically fit and healthy to participate in this championship, I am participating voluntarily and at my own risk. I take full responsibility for my health during the event, and organizers shall not be held responsible."
                    >
                      <input className={inputClass} placeholder="Your answer"
                        value={form.medicalDeclaration} onChange={(e) => update("medicalDeclaration", e.target.value)} />
                    </Field>
                  </div>
                )}

                {/* Step 5: Review */}
                {step === 5 && (
                  <div className="space-y-5">
                    <ReviewSection title="Personal Details">
                      <ReviewRow label="Name" value={form.fullName} />
                      <ReviewRow label="Email ID" value={form.email} />
                      {form.fatherName && <ReviewRow label="Father's Name" value={form.fatherName} />}
                      <ReviewRow label="Contact Number" value={form.contactNumber} />
                      <ReviewRow label="Date of Birth" value={form.dob} />
                      <ReviewRow label="Address" value={form.address} />
                      <ReviewRow label="Gender" value={form.gender} />
                    </ReviewSection>
                    <ReviewSection title="Category">
                      <ReviewRow label="Age Category" value={ageCategories.find((c) => c.id === form.ageCategory)?.label ?? ""} />
                      <ReviewRow label="Game Option" value={form.gameOption === "traditional" ? "Traditional" : "Artistic Pair"} />
                    </ReviewSection>
                    <ReviewSection title="Documents & Payment">
                      <ReviewRow label="Passport Photo" value={form.passportPhoto?.name ?? "Not uploaded"} />
                      <ReviewRow label="Aadhar ID Photo" value={form.aadharPhoto?.name ?? "Not uploaded"} />
                      <ReviewRow label="Payment ID" value={form.paymentId} />
                      <ReviewRow label="Payment Screenshot" value={form.paymentScreenshot?.name ?? "Not uploaded"} />
                    </ReviewSection>
                    <ReviewSection title="Coach & Declarations">
                      <ReviewRow label="Coach & School" value={form.coachSchool} />
                      {form.clubOrg && <ReviewRow label="Club / Organization" value={form.clubOrg} />}
                      <ReviewRow label="Parents Declaration" value={form.parentsDeclaration} />
                      <ReviewRow label="Medical Fitness Declaration" value={form.medicalDeclaration} />
                    </ReviewSection>
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                      This is a mock preview — nothing is submitted to a server yet.
                    </div>
                  </div>
                )}

                {/* Nav buttons */}
                <div className="flex items-center justify-between mt-10">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 0}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-black/50 hover:text-black disabled:opacity-0 disabled:pointer-events-none transition-opacity"
                  >
                    <HiOutlineArrowLeft className="h-4 w-4" /> Back
                  </button>

                  {step < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex items-center gap-2 rounded-full bg-[color:var(--lm-maroon)] text-white px-6 py-3 text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                      Continue <HiOutlineArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-6 py-3 text-sm font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Submit Registration <HiOutlineCheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <p className="text-center text-xs text-black/40 mt-8">
            For more details, contact 9826633329 / 9826421747
          </p>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  note,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {note && <p className="text-xs italic text-black/45 mb-2">{note}</p>}
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function FileField({
  label,
  required,
  hint,
  error,
  file,
  preview,
  onChange,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  file: File | null;
  preview?: string;
  onChange: (file: File | null) => void;
}) {
  const inputId = React.useId();
  return (
    <Field label={label} required={required} error={error}>
      {hint && <p className="text-xs text-black/40 mb-2">{hint}</p>}
      <label
        htmlFor={inputId}
        className={classNames(
          "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 cursor-pointer transition-colors",
          preview ? "border-emerald-300 bg-emerald-50/40" : "border-black/15 hover:border-[color:var(--lm-maroon)]/40 hover:bg-black/[0.02]"
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={`${label} preview`} className="max-h-40 rounded-lg object-contain" />
        ) : (
          <>
            <HiOutlineUpload className="h-6 w-6 text-black/30" />
            <span className="text-sm font-medium text-black/60">Add file</span>
          </>
        )}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {file && (
        <div className="flex items-center justify-between mt-2 text-xs text-black/50">
          <span className="truncate">{file.name}</span>
          <button type="button" className="text-red-500 font-semibold flex-shrink-0 ml-2" onClick={() => onChange(null)}>
            Remove
          </button>
        </div>
      )}
    </Field>
  );
}

/**
 * Visual placeholder only — not a scannable code. Swap for the real bank
 * UPI QR image once the client supplies it.
 */
function MockQrCode() {
  const size = 9;
  const seed = 42;
  const cells: boolean[] = React.useMemo(() => {
    let s = seed;
    const rand = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return (s % 100) / 100;
    };
    return Array.from({ length: size * size }, () => rand() > 0.5);
  }, []);

  const isFinder = (r: number, c: number) =>
    (r < 3 && c < 3) || (r < 3 && c >= size - 3) || (r >= size - 3 && c < 3);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-24 w-24" role="img" aria-label="Sample QR code placeholder">
      <rect width={size} height={size} fill="white" />
      {cells.map((on, i) => {
        const r = Math.floor(i / size);
        const c = i % size;
        if (isFinder(r, c) || !on) return null;
        return <rect key={i} x={c} y={r} width={1} height={1} fill="black" />;
      })}
      {[
        [0, 0],
        [0, size - 3],
        [size - 3, 0],
      ].map(([fr, fc]) => (
        <g key={`${fr}-${fc}`}>
          <rect x={fc} y={fr} width={3} height={3} fill="black" />
          <rect x={fc + 0.6} y={fr + 0.6} width={1.8} height={1.8} fill="white" />
          <rect x={fc + 1} y={fr + 1} width={1} height={1} fill="black" />
        </g>
      ))}
    </svg>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-neutral-50 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-black/45">{label}</span>
      <span className="font-semibold text-right capitalize">{value || "—"}</span>
    </div>
  );
}

function SuccessScreen({ regId, onReset }: { regId: string; onReset: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
        <HiOutlineCheckCircle className="h-9 w-9 text-emerald-600" />
      </div>
      <h3 className="font-heading text-2xl font-bold mb-2">Registration Received (Mock)</h3>
      <p className="text-sm text-black/50 max-w-sm mx-auto mb-6">
        This is a UI-only confirmation for client review. No data has actually been saved yet.
      </p>
      <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--lm-maroon)]/10 text-[color:var(--lm-maroon)] px-5 py-2 text-sm font-bold mb-8">
        Mock Registration ID: {regId}
      </div>
      <div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-semibold text-[color:var(--lm-maroon)] hover:underline"
        >
          Register another athlete
        </button>
      </div>
    </div>
  );
}
