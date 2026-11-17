import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Santosh Barigedi — Portfolio",
  description:
    "Portfolio of B. Sai Santosh Kumar — Full-Stack Vibe Developer, Problem-Solving Builder & Cyber Security Specialist.",
  openGraph: {
    title: "Santosh Barigedi — Portfolio",
    description: "Full-Stack Vibe Developer · Problem-Solving Builder · Cyber Security",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable}`}
    >
      <body className="bg-bg text-ivory font-sans antialiased min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
