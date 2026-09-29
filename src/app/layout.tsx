import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import "./cinematic.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConditionalShell } from "@/components/ConditionalShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { KEYWORDS, SITE, SITE_URL, siteGraph } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jobstm — Verified Gig Hiring Platform in India | Gig Jobs",
    template: "%s | Jobstm",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: KEYWORDS,
  authors: [{ name: SITE.legalName, url: SITE_URL }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "Employment",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    locale: "en_IN",
    title: "Jobstm — Verified Gig Hiring Platform in India",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobstm — Verified Gig Hiring Platform in India",
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  // Geo signals for local search (Khandwa, Madhya Pradesh, India)
  other: {
    "geo.region": "IN-MP",
    "geo.placename": "Khandwa, Madhya Pradesh",
    "geo.position": `${SITE.geo.latitude};${SITE.geo.longitude}`,
    ICBM: `${SITE.geo.latitude}, ${SITE.geo.longitude}`,
    "content-language": "en-IN",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/assets/generated/ico.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1f35",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} ${inter.className}`}>
        <JsonLd data={siteGraph()} />
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
