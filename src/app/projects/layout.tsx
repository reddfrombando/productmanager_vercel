import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Portfolio Projects: Step-by-Step Guide",
  description: "Build 12 progressive, industry-grade projects mimicking real Product Manager tasks at Google and Stripe. Craft complete PRDs and Figma wireframes.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
