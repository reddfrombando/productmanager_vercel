import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Syllabus: Complete Open Academy Path",
  description: "Browse our 12-phase curriculum for the modern Product Manager. Access modules covering customer discovery, APIs, dynamic pricing, and AI agent UX.",
};

export default function CurriculumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
