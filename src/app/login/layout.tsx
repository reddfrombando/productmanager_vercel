import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Academy Login: Start Learning Now",
  description: "Access your student profile on the Product Manager Foundations academy. Log in to track progress, write topic notes, and complete assignments.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
