import {
  HiOutlineBadgeCheck,
  HiOutlineUserGroup,
  HiTrendingUp,
  HiOutlineViewGrid,
} from "react-icons/hi";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const values = [
  {
    title: "Excellence",
    description: "Committed to delivering the highest quality in every project",
    icon: HiOutlineBadgeCheck,
  },
  {
    title: "Results-Focused",
    description: "Driven by measurable outcomes and client success",
    icon: HiOutlineViewGrid,
  },
  {
    title: "Client-Centric",
    description: "Your goals and satisfaction are our top priority",
    icon: HiOutlineUserGroup,
  },
  {
    title: "Innovation",
    description: "Continuously evolving to meet market demands",
    icon: HiTrendingUp,
  },
];

export function CoreValuesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <ScrollReveal animation="fade-up">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
        </ScrollReveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <ScrollReveal key={value.title} animation="scale" delay={index * 100}>
                <Card className="py-6 text-center hover-lift transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
