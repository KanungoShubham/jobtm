import type { Metadata } from "next";

/** Single source of truth for SEO / AEO / GEO. Facts here come from the site's own content. */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jobstm.co").replace(/\/$/, "");

export const SITE = {
  name: "Jobstm",
  alternateNames: ["JobsTM", "Jobs TM"],
  legalName: "Maikal and Taksharya Pvt Limited",
  foundingDate: "2011",
  email: "infomnt01@gmail.com",
  phone: "+91-9669099914",
  logo: `${SITE_URL}/assets/jobslogo.png`,
  tagline: "Trusted, verification-first gig hiring platform",
  description:
    "Jobstm is a secure, verification-first gig hiring platform that connects verified gig workers and students with trusted companies for flexible, on-demand work across India. Built by Maikal and Taksharya Pvt Limited, Khandwa, Madhya Pradesh — serving since 2011.",
  address: {
    streetAddress: "03 Friends Colony, Punjab Colony, Mata Chowk",
    addressLocality: "Khandwa",
    addressRegion: "Madhya Pradesh",
    postalCode: "450001",
    addressCountry: "IN",
  },
  // City-level coordinates for Khandwa, Madhya Pradesh
  geo: { latitude: 21.8253, longitude: 76.35 },
  areaServed: ["India", "Madhya Pradesh", "Khandwa", "Indore"],
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { days: ["Saturday"], opens: "10:00", closes: "16:00" },
  ],
} as const;

/** Search intents we want to be found for (used in meta keywords + llms.txt; page copy stays natural). */
export const KEYWORDS = [
  "Jobstm",
  "JobsTM",
  "gig hiring platform India",
  "verified gig workers",
  "on-demand hiring",
  "hire gig workers",
  "gig jobs Madhya Pradesh",
  "gig jobs Khandwa",
  "gig jobs Indore",
  "part-time jobs for students",
  "freelance jobs India",
  "flexible jobs near me",
  "verification-first hiring",
  "background verified candidates",
  "job portal Madhya Pradesh",
  "manpower hiring agency Khandwa",
  "manpower recruitment Madhya Pradesh",
  "vocational training Khandwa",
  "promotion activities staffing",
  "upskilling courses and certifications",
  "Maikal and Taksharya Pvt Limited",
];

/** Answers are written for AI answer engines and Google rich results; they mirror on-page facts only. */
export const FAQS: { q: string; a: string }[] = [
  {
    q: "What is Jobstm?",
    a: "Jobstm is a secure, verification-first gig hiring platform that connects qualified gig workers and students with trusted companies for flexible, on-demand work. It is built by Maikal and Taksharya Pvt Limited in Khandwa, Madhya Pradesh, and the company has served clients since 2011.",
  },
  {
    q: "How does Jobstm verify gig workers and companies?",
    a: "Gig workers are verified on identity, education and availability. Companies are verified on identity, contact details and an authorised representative, and submit PAN and registration documents. Only verified users are on both sides of the platform, so every hire is backed by real identity and document checks.",
  },
  {
    q: "How can companies hire gig workers on Jobstm?",
    a: "A company registers, uploads its documents and, after admin verification (usually 24–48 hours), can log in, post jobs, review applications and hire pre-verified gig workers. Jobstm is designed so companies can connect with talent in minutes.",
  },
  {
    q: "How can I find gig work or part-time jobs on Jobstm?",
    a: "Create a free job seeker account with your mobile number, complete your profile with skills and availability, then browse verified jobs and apply. Verified profiles help companies shortlist you faster. Jobstm runs a launch offer with free applications for early users.",
  },
  {
    q: "What services does the company behind Jobstm offer?",
    a: "Besides the Jobstm gig platform, Maikal and Taksharya Pvt Limited provides vocational training, manpower hiring and recruitment, promotion activities (campaigns and event management) and upskilling programmes with courses and certifications.",
  },
  {
    q: "Where is Jobstm based and which areas does it serve?",
    a: "Jobstm is based in Khandwa, Madhya Pradesh, India (03 Friends Colony, Punjab Colony, Mata Chowk, Khandwa 450001). It serves gig workers and companies in Khandwa, Indore and across Madhya Pradesh and India.",
  },
  {
    q: "How do I contact Jobstm?",
    a: "Email infomnt01@gmail.com or call +91 9669099914. Business hours are Monday to Friday 9:00 AM to 6:00 PM and Saturday 10:00 AM to 4:00 PM IST, and the contact form on the Contact page is answered within 24 hours.",
  },
];

const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "Jobstm — Verified Gig Hiring Platform in India" };

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** Use for pages that should not appear in search (auth, dashboards). */
  noindex?: boolean;
  /** Skip the " | Jobstm" suffix (home page). */
  absoluteTitle?: boolean;
}

export function pageMetadata({ title, description, path, keywords, noindex, absoluteTitle }: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords ?? KEYWORDS,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      url: path,
      siteName: SITE.name,
      locale: "en_IN",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
  };
}

/* ───────────────────────── JSON-LD builders ───────────────────────── */

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "EmploymentAgency"],
        "@id": ORG_ID,
        name: SITE.name,
        legalName: SITE.legalName,
        alternateName: SITE.alternateNames,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: SITE.logo },
        image: SITE.logo,
        description: SITE.description,
        slogan: SITE.tagline,
        foundingDate: SITE.foundingDate,
        email: SITE.email,
        telephone: SITE.phone,
        address: { "@type": "PostalAddress", ...SITE.address },
        geo: { "@type": "GeoCoordinates", ...SITE.geo },
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "State", name: "Madhya Pradesh" },
          { "@type": "City", name: "Khandwa" },
          { "@type": "City", name: "Indore" },
        ],
        openingHoursSpecification: SITE.hours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [...h.days],
          opens: h.opens,
          closes: h.closes,
        })),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: SITE.email,
          telephone: SITE.phone,
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
        knowsAbout: [
          "Gig hiring",
          "Verified gig workers",
          "On-demand hiring",
          "Manpower recruitment",
          "Vocational training",
          "Promotion activities",
          "Upskilling",
        ],
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: SITE_URL,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function faqLd(items = FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function webPageLd(type: "AboutPage" | "ContactPage" | "WebPage", name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: `${SITE_URL}${path}`,
    inLanguage: "en-IN",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
  };
}

export function serviceCatalogLd(services: { name: string; description: string; features: string[] }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Jobstm services",
    url: `${SITE_URL}/services`,
    provider: { "@id": ORG_ID },
    itemListElement: services.map((s) => ({
      "@type": "Service",
      name: s.name,
      description: s.description,
      serviceType: s.name,
      provider: { "@id": ORG_ID },
      areaServed: { "@type": "Country", name: "India" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${s.name} features`,
        itemListElement: s.features.map((f) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: f } })),
      },
    })),
  };
}
