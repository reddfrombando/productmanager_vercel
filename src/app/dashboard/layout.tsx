import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Learning Workspace - Student Dashboard",
  description: "Review your daily study streak, check off completed concepts, read recent notes, and manage active bookmarks on your Product Manager workspace.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
