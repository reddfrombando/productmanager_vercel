import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Module: Interactive Syllabus Concepts",
  description: "Study specific curriculum modules in our Product Manager academy. Complete exercises, inspect reading resources, and test skills with mock quizzes.",
};

export default function ModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
