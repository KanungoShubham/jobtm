import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// Account chooser: useful to users, not something we want ranking in search.
export const metadata: Metadata = pageMetadata({
  title: "Sign In",
  description: "Sign in to your Jobstm employer, job seeker or ad center account.",
  path: "/login",
  noindex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
