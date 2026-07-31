import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Case Studies: Real Business Analysis",
  description: "Analyze strategic choices, metric frameworks, and interview prep prompt responses implemented by the modern Product Manager at top tech firms.",
};

export default function CasesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
