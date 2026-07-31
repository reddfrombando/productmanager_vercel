import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Career Hub: Resume Bullets & Prep",
  description: "Get hired as a Product Manager. Practice product sense interview prompts, read salary guides, and construct quantitative Google-style resumes.",
};

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
