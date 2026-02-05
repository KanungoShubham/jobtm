import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jobstm - Trusted Gig Hiring Platform",
  description:
    "A secure, verification-first gig hiring platform connecting qualified gig workers and students with trusted companies. Built by Maikal and Taksharya Pvt Limited.",
  keywords: [
    "gig hiring",
    "gig workers",
    "freelance jobs",
    "verified talent",
    "on-demand hiring",
    "job platform",
    "jobstm",
    "student jobs",
    "flexible work",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/assets/generated/ico.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col overflow-x-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden pt-16">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
