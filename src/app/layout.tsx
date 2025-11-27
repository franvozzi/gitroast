import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitRoast | AI Code Reviewer",
  description: "Get your code roasted by a cynical AI. GitRoast analyzes your GitHub repository and gives you a brutal (but funny) review using Google Gemini.",
  keywords: ["git", "roast", "ai", "code review", "gemini", "github", "developer", "humor"],
  authors: [{ name: "GitRoast Team" }],
  openGraph: {
    title: "GitRoast | AI Code Reviewer",
    description: "Dare to get your code roasted? AI-powered code analysis with a spicy twist.",
    type: "website",
    locale: "en_US",
    siteName: "GitRoast",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitRoast | AI Code Reviewer",
    description: "Your code is bad and you should feel bad. Let AI tell you why.",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔥</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-slate-200`}
      >
        {children}
      </body>
    </html>
  );
}
