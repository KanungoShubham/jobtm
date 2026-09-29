import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Yogasana Championship 2026 Registration",
  description:
    "Register for the Yogasana Championship 2026 organized by Lakshya Water Solution & Welfare Society. Age categories 8–14, 14–20 and 20+. Register online.",
  path: "/lakshya-manthan",
  keywords: ["Yogasana Championship 2026", "Lakshya Manthan", "yoga championship registration", "Lakshya Water Solution & Welfare Society"],
});

export default function LakshyaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
