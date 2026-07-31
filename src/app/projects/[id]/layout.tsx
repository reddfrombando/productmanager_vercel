import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Project: Build Applied PM Portfolios",
  description: "Create high-quality artifacts for your Product Manager profile. Read business cases, review Figma design guidelines, and copy sample PRD drafts.",
};

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
