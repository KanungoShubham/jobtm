import { HiEye } from "react-icons/hi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function VisionMissionSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <ScrollReveal animation="fade-up">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Vision & Mission
            </h2>
            <p className="text-lg text-muted-foreground">
              Guiding our purpose and direction
            </p>
          </div>
        </ScrollReveal>
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Vision Card */}
          <ScrollReveal animation="scale" delay={100}>
            <Card className="py-6 hover-lift transition-all duration-300">
              <CardHeader>
                <div className="mb-4">
                  <HiEye className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="mb-2">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Connecting every hand to meaningful work through technology.
                </CardDescription>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Mission Card */}
          <ScrollReveal animation="scale" delay={250}>
            <Card className="py-6 hover-lift transition-all duration-300">
              <CardHeader>
                <div className="mb-4">
                  <HiOutlineLocationMarker className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="mb-2">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  To build innovative digital platforms that empower youth to access
                  flexible and sustainable earning opportunities.
                </CardDescription>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
