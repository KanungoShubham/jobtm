import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConditionalShell } from "@/components/ConditionalShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

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
      <body className={`${inter.variable} ${sora.variable} ${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <ConditionalShell>{children}</ConditionalShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
