import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, pageMetadata, webPageLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Jobstm — Khandwa, Madhya Pradesh",
  description:
    "Contact Jobstm in Khandwa, Madhya Pradesh: email infomnt01@gmail.com or call +91 9669099914 about gig hiring, manpower and training. We reply in 24 hours.",
  path: "/contact",
  keywords: ["contact Jobstm", "Jobstm Khandwa", "manpower hiring Khandwa", "gig hiring enquiry", "Jobstm phone number"],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          webPageLd("ContactPage", "Contact Jobstm", "/contact", "Reach Jobstm in Khandwa, Madhya Pradesh by email, phone or the contact form."),
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
        ]}
      />
      {children}
    </>
  );
}
