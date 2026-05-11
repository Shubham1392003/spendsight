import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpendSight AI | Stop Overspending on AI Tools",
  description: "Instantly audit your AI stack, uncover waste, and reduce infrastructure costs with enterprise-grade precision.",
  keywords: ["AI Spend", "AI Infrastructure", "SaaS Audit", "Cost Optimization", "OpenAI Pricing", "Anthropic Claude"],
  openGraph: {
    title: "SpendSight AI | Audit Your AI Stack",
    description: "Instantly audit your AI stack, uncover waste, and reduce infrastructure costs with enterprise-grade precision.",
    type: "website",
    url: "https://spendsight.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendSight AI",
    description: "Stop Overspending on AI Tools. Get a free AI stack audit.",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
