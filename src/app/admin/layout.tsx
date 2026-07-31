import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Administrator Panel: Curation Queue",
  description: "Review contributed tutorials, approve learning links, check platform analytics, and manage the publishing queue on the Product Manager dashboard.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
