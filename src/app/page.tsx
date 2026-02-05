import Link from "next/link";
import {
  HiDatabase,
  HiDocumentText,
  HiLockClosed,
  HiClock,
  HiTrendingUp,
  HiViewGridAdd,
  HiBadgeCheck,
  HiUsers,
  HiLightningBolt,
  HiShieldCheck,
  HiBriefcase,
  HiCheckCircle,
  HiLocationMarker,
} from "react-icons/hi";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"></div>
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start animate-fade-in-up">
              <span className="inline-flex items-center rounded-md border border-transparent bg-secondary text-secondary-foreground px-4 py-1.5 text-sm font-medium hover-lift hover-shine">
                By Maikal and Taksharya Pvt Limited
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border px-4 py-1.5 text-sm font-medium hover-lift hover-shine">
                <HiLocationMarker className="h-4 w-4" />
                Khandwa, MP
              </span>
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 animate-slide-in-rotate animate-delay-100">
              Trusted Gig Hiring.{" "}
              <span className="text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-bounce-in-up">Verified Talent.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in-up animate-delay-200">
              Smarter Workforce Through Verification-First Onboarding
            </p>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl animate-fade-in-up animate-delay-300">
              We are building a secure, verification-first gig hiring ecosystem
              that connects qualified gig workers and students with trusted
              companies—quickly, transparently, and at scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-400">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto shadow-warm hover:shadow-warm-lg hover-lift hover-shine">
                  Get Started
                  <HiCheckCircle className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto hover-lift hover-shine">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* One Platform Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse animate-delay-500"></div>
        </div>
        <div className="container relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                One Platform. One Source of Truth.
              </h2>
              <p className="text-lg text-muted-foreground">
                All user data and documents are securely managed within our core
                Jobstm system.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto perspective-container">
            <ScrollReveal animation="scale" delay={100}>
              <Card className="py-6 border-2 hover:border-primary/50 transition-all duration-300 card-3d hover-shine group h-full">
                <CardHeader>
                  <HiDatabase className="h-10 w-10 text-primary mb-3 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <CardTitle className="leading-none">No Duplicate Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Single centralized database ensures data integrity and
                    consistency across the platform
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>
            <ScrollReveal animation="scale" delay={200}>
              <Card className="py-6 border-2 hover:border-primary/50 transition-all duration-300 card-3d hover-shine group h-full">
                <CardHeader>
                  <HiDocumentText className="h-10 w-10 text-primary mb-3 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <CardTitle className="leading-none">
                    No Fragmented Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    One verified profile per user maintained in our unified system
                    of record
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>
            <ScrollReveal animation="scale" delay={300}>
              <Card className="py-6 border-2 hover:border-primary/50 transition-all duration-300 card-3d hover-shine group h-full">
                <CardHeader>
                  <HiLockClosed className="h-10 w-10 text-primary mb-3 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <CardTitle className="leading-none">Secure Gateway</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Professional onboarding portal with all data residing in the
                    secure Jobstm core
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Verification-First Onboarding */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float-slow"></div>
        </div>
        <div className="container relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Verification-First Onboarding
              </h2>
              <p className="text-lg text-muted-foreground">
                Our platform is designed to meet modern hiring standards,
                combining technology, compliance, and ease of use.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto perspective-container">
            {/* For Gig Workers */}
            <ScrollReveal animation="fade-left" delay={100}>
              <Card className="py-6 border-2 hover-3d hover-shine group h-full">
              <CardHeader>
                <span className="inline-flex w-fit items-center rounded-md border border-transparent bg-primary text-primary-foreground px-2 py-0.5 text-xs font-medium mb-3 animate-bounce-in">
                  For Gig Workers
                </span>
                <CardTitle className="text-2xl">
                  Structured Yet Simple Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-primary">
                    What We Verify:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Identity and age eligibility (18+)
                    </li>
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Education and skill profile
                    </li>
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Work preferences and availability
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-primary">
                    Why It Matters:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Genuine profiles only
                    </li>
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Faster shortlisting for companies
                    </li>
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Higher trust for hiring companies
                    </li>
                  </ul>
                </div>
                <p className="text-sm font-medium pt-2">
                  This ensures companies work with ready-to-hire, verified
                  talent.
                </p>
              </CardContent>
            </Card>
            </ScrollReveal>

            {/* For Companies */}
            <ScrollReveal animation="fade-right" delay={200}>
              <Card className="py-6 border-2 hover-3d hover-shine group h-full">
              <CardHeader>
                <span className="inline-flex w-fit items-center rounded-md border border-transparent bg-primary text-primary-foreground px-2 py-0.5 text-xs font-medium mb-3 animate-bounce-in animate-delay-200">
                  For Companies
                </span>
                <CardTitle className="text-2xl">
                  Business-Grade Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-primary">
                    What We Verify:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Company identity and industry
                    </li>
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Official contact details
                    </li>
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Authorized hiring representative
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-primary">
                    Why It Matters:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Safe hiring environment
                    </li>
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Trusted job postings
                    </li>
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Better engagement from gig workers
                    </li>
                  </ul>
                </div>
                <p className="text-sm font-medium pt-2">
                  Only verified organizations can post opportunities on the
                  platform.
                </p>
              </CardContent>
            </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* For Gig Workers Feature Section */}
      <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/3 left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        </div>
        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
            <ScrollReveal animation="fade-right" delay={100}>
              <div>
                <span className="inline-flex w-fit items-center rounded-md border border-transparent bg-primary text-primary-foreground px-2 py-0.5 text-xs font-medium mb-4">
                  For Gig Workers
                </span>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Find Work That Fits Your Life
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Take control of your career with flexible gig opportunities that
                match your skills and schedule.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex gap-4 animate-slide-from-left animate-delay-100 hover-float transition-all duration-300 p-3 rounded-lg group hover:bg-primary/5">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <HiClock className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Work on Your Schedule</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose when and where you work with complete flexibility
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 animate-slide-from-left animate-delay-200 hover-float transition-all duration-300 p-3 rounded-lg group hover:bg-primary/5">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <HiTrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Grow Your Income</h3>
                    <p className="text-sm text-muted-foreground">
                      Access multiple income streams and increase your earning
                      potential
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 animate-slide-from-left animate-delay-300 hover-float transition-all duration-300 p-3 rounded-lg group hover:bg-primary/5">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <HiViewGridAdd className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Match Your Skills</h3>
                    <p className="text-sm text-muted-foreground">
                      Find gigs that align with your expertise and interests
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 animate-slide-from-left animate-delay-400 hover-float transition-all duration-300 p-3 rounded-lg group hover:bg-primary/5">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <HiBadgeCheck className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Build Your Reputation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Earn ratings and reviews to unlock better opportunities
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/contact">
                <Button className="shadow-warm hover-lift hover-shine">
                  Start Working Today
                  <HiCheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={200}>
              <div className="relative group">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 shadow-warm-lg card-3d transition-all duration-500 group-hover:shadow-2xl">
                  <div className="h-full w-full rounded-xl bg-card border-2 border-primary/20 flex items-center justify-center transition-all duration-500 group-hover:border-primary/40">
                    <HiBriefcase className="h-32 w-32 text-primary/40 animate-card-float transition-all duration-500 group-hover:text-primary/60 group-hover:scale-110" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* For Businesses Feature Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>
        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
            <ScrollReveal animation="fade-right" delay={200}>
              <div className="order-2 lg:order-1 relative group">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 p-8 shadow-warm-lg card-3d transition-all duration-500 group-hover:shadow-2xl">
                  <div className="h-full w-full rounded-xl bg-card border-2 border-accent/20 flex items-center justify-center transition-all duration-500 group-hover:border-accent/40">
                    <HiUsers className="h-32 w-32 text-accent/40 animate-card-tilt transition-all duration-500 group-hover:text-accent/60 group-hover:scale-110" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={100}>
              <div className="order-1 lg:order-2">
                <span className="inline-flex w-fit items-center rounded-md border border-transparent bg-primary text-primary-foreground px-2 py-0.5 text-xs font-medium mb-4">
                  For Businesses
                </span>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Hire Skilled Talent On-Demand
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Scale your workforce instantly with qualified gig workers ready
                to deliver results.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex gap-4 animate-slide-from-right animate-delay-100 hover-float transition-all duration-300 p-3 rounded-lg group hover:bg-accent/5">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <HiLightningBolt className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Fast Hiring</h3>
                    <p className="text-sm text-muted-foreground">
                      Post a job and connect with qualified workers in minutes
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 animate-slide-from-right animate-delay-200 hover-float transition-all duration-300 p-3 rounded-lg group hover:bg-accent/5">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <HiShieldCheck className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Verified Professionals
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      All workers are pre-screened and background-checked
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 animate-slide-from-right animate-delay-300 hover-float transition-all duration-300 p-3 rounded-lg group hover:bg-accent/5">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <HiTrendingUp className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Cost-Effective</h3>
                    <p className="text-sm text-muted-foreground">
                      Pay only for the work you need without long-term
                      commitments
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 animate-slide-from-right animate-delay-400 hover-float transition-all duration-300 p-3 rounded-lg group hover:bg-accent/5">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <HiViewGridAdd className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Quality Guaranteed</h3>
                    <p className="text-sm text-muted-foreground">
                      Rate and review workers to ensure consistent quality
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/contact">
                <Button variant="outline" className="shadow-warm hover-lift hover-shine">
                  Post Your First Job
                  <HiCheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse animate-delay-700"></div>
        </div>
        <div className="container relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                How Jobstm Works
              </h2>
              <p className="text-lg text-muted-foreground">
                Getting started is simple. Follow these easy steps to begin your
                gig work journey.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto perspective-container">
            {[
              {
                number: "01",
                icon: HiUsers,
                title: "Sign Up",
                description:
                  "Create your free account in minutes with Internet Identity authentication",
              },
              {
                number: "02",
                icon: HiViewGridAdd,
                title: "Complete Profile",
                description:
                  "Add your skills, experience, and preferences to match with the right opportunities",
              },
              {
                number: "03",
                icon: HiBriefcase,
                title: "Browse & Apply",
                description:
                  "Explore available gigs or post jobs, then connect with the perfect match",
              },
              {
                number: "04",
                icon: HiTrendingUp,
                title: "Work & Earn",
                description:
                  "Complete projects, get paid securely, and build your reputation on the platform",
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={step.number} animation="slide-up" delay={index * 150}>
                  <Card className="py-6 relative border-2 hover:border-primary/50 transition-all card-3d hover-shine group h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-5xl font-bold text-primary/20 font-heading transition-all duration-500 group-hover:text-primary/50 group-hover:scale-125">
                          {step.number}
                        </span>
                        <Icon className="h-8 w-8 text-primary transition-all duration-500 group-hover:scale-150 group-hover:rotate-[360deg]" />
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="container relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Why Companies & Gig Workers Trust Us
              </h2>
              <p className="text-lg text-muted-foreground">
                Built for scale, security, and speed with industry-standard
                practices
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                title: "Verified Profiles",
                description: "Both sides verified for trust and safety",
              },
              {
                title: "Faster Hiring",
                description: "Streamlined onboarding and matching process",
              },
              {
                title: "Professional Experience",
                description: "Business-grade platform and support",
              },
              {
                title: "Compliance-Ready",
                description: "Industry-standard data handling and security",
              },
              {
                title: "Secure Documents",
                description: "Centralized, encrypted document management",
              },
              {
                title: "Long-Term Scalability",
                description: "Built to grow with your needs",
              },
            ].map((benefit, index) => (
              <ScrollReveal key={benefit.title} animation="fade-up" delay={index * 100}>
                <div className="flex gap-3 p-4 rounded-lg hover:bg-muted/50 transition-all duration-300 hover-float group cursor-pointer border border-transparent hover:border-primary/20">
                  <HiCheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1 transition-all duration-500 group-hover:scale-150 group-hover:rotate-[360deg]" />
                  <div>
                    <h3 className="font-semibold mb-1 transition-colors duration-300 group-hover:text-primary">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 left-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-accent/30 rounded-full blur-3xl animate-float-slow"></div>
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6 animate-scale-in-bounce">
              Ready to Transform Your Work Life?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
              Join Jobstm today and discover the freedom of gig work or the
              flexibility of on-demand hiring
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto shadow-warm-lg hover-lift hover-shine animate-glow">
                  Sign Up Now
                  <HiCheckCircle className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto hover-lift hover-shine">
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-8 animate-fade-in animate-delay-500">
              Proudly built by{" "}
              <span className="font-semibold">
                Maikal and Taksharya Pvt Limited
              </span>{" "}
              • Indore, Madhya Pradesh
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
