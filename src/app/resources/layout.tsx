import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Resource Library: Book Lists & Guides",
  description: "Find curated book lists, project templates, framework checklists, and podcast episodes recommended by a practicing Product Manager on our portal.",
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
