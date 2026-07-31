import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Case Study: Strategic Analysis Guides",
  description: "Examine real business strategies and PM frameworks in our Product Manager case library. Learn from Stripe, Netflix, and OpenAI product outcomes.",
};

export default function CaseDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
