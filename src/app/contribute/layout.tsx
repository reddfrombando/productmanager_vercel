import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Contributor Portal: Recommend Links",
  description: "Share learning resources with our community. Recommend video tutorials, frameworks, or templates to expand the Product Manager open curriculum catalog.",
};

export default function ContributeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
