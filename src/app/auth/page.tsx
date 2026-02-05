"use client";

import * as React from "react";
import Link from "next/link";
import { HiShieldCheck, HiLogin, HiUserAdd, HiMail, HiLockClosed } from "react-icons/hi";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function AuthPage() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!isLogin && !formData.name) {
      setError("Please enter your name");
      setLoading(false);
      return;
    }

    // Simulate authentication
    setTimeout(() => {
      // For demo purposes - in production, this would connect to your backend
      console.log(isLogin ? "Logging in..." : "Registering...", formData);
      setLoading(false);
      // Redirect or show success
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div>
      <section className="py-16 md:py-24">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {isLogin
                  ? "Welcome back! Sign in to your account"
                  : "Join Jobstm and start your gig work journey"}
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto max-w-md py-8">
            <ScrollReveal animation="scale" delay={150}>
              <Card className="py-6 hover-lift transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <HiShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  {isLogin ? "Sign In to Your Account" : "Create Your Account"}
                </CardTitle>
                <CardDescription className="text-sm">
                  {isLogin
                    ? "Enter your credentials to access your account"
                    : "Fill in your details to get started"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="relative w-full rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm">
                      <p className="text-destructive">{error}</p>
                    </div>
                  )}

                  {!isLogin && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your full name"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {isLogin && (
                    <div className="flex justify-end">
                      <a
                        href="#"
                        className="text-sm text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Password reset functionality coming soon!");
                        }}
                      >
                        Forgot password?
                      </a>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full gap-2 hover-shine"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {isLogin ? "Signing In..." : "Creating Account..."}
                      </>
                    ) : (
                      <>
                        {isLogin ? (
                          <>
                            <HiLogin className="h-5 w-5" />
                            Sign In
                          </>
                        ) : (
                          <>
                            <HiUserAdd className="h-5 w-5" />
                            Create Account
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError("");
                      setFormData({ email: "", password: "", name: "" });
                    }}
                    className="font-medium text-primary hover:underline"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </CardFooter>
            </Card>
            </ScrollReveal>

            {!isLogin && (
              <ScrollReveal animation="fade-up" delay={300}>
                <p className="mt-6 text-center text-xs text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
