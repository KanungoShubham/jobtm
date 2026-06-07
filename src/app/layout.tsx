import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConditionalShell } from "@/components/ConditionalShell";

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
          <ConditionalShell>{children}</ConditionalShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
