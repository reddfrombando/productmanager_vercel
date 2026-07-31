import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Lecture: Video Tutorials and Notebook",
  description: "Watch PM video lectures, perform practice prompts, and take notes in the personal notepad on the Product Manager academy interactive workspaces.",
};

export default function TopicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
