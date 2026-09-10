import type { Metadata } from "next";
import "./globals.css";
import AnalyticsConsent from "@/components/analytics-consent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Internet Toolbox | Free online tools for everyday tasks",
    template: "%s | Internet Toolbox",
  },
  description: "Free online calculators, converters, text tools and file utilities for everyday tasks. Fast, clear and no account required.",
  applicationName: "Internet Toolbox",
  keywords: ["online tools", "free calculators", "unit converter", "percentage calculator", "EMI calculator", "GST calculator", "text tools", "developer tools", "image compressor"],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Internet Toolbox",
    title: "Internet Toolbox | Free online tools for everyday tasks",
    description: "Free online calculators, converters, text tools and file utilities for everyday tasks. Fast, clear and no account required.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "Internet Toolbox | Free online tools for everyday tasks",
    description: "Free online calculators, converters, text tools and file utilities for everyday tasks.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<AnalyticsConsent /></body>
    </html>
  );
}
