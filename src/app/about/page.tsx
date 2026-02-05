import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { VisionMissionSection } from "@/components/sections/VisionMissionSection";
import { CoreValuesSection } from "@/components/sections/CoreValuesSection";
import { LegacySection } from "@/components/sections/LegacySection";

export const metadata: Metadata = {
  title: "About Us - JOBS TM",
  description:
    "Serving clients since 2011, we've built a reputation for excellence in vocational training, manpower hiring, and promotional activities. As established marketing professionals, we deliver proven strategies that drive real business results.",
};

export default function AboutPage() {
  return (
    <div>
      <HeroSection
        title="About Our Company"
        description="Serving clients since 2011, we've built a reputation for excellence in vocational training, manpower hiring, and promotional activities. As established marketing professionals, we deliver proven strategies that drive real business results."
      />
      <JourneySection />
      <VisionMissionSection />
      <CoreValuesSection />
      <LegacySection />
    </div>
  );
}
