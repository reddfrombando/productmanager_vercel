import type { Metadata } from "next";
import { Inter, Space_Grotesk, Manrope } from "next/font/google";
import { PlatformProvider } from "@/context/PlatformContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Product Manager Foundations: Premium Learning Academy",
  description: "Master modern software execution with our free Product Manager curriculum. Build wireframes and write PRDs in our 12 portfolio projects. Get hired.",
  metadataBase: new URL("https://pmfoundations.com"),
  openGraph: {
    title: "Product Manager Foundations",
    description: "Structured self-paced curriculum for modern and AI Product Management.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0A192F] font-sans">
        <PlatformProvider>
          {children}
        </PlatformProvider>
      </body>
    </html>
  );
}
