import type { Metadata } from "next";
import "./globals.css";
import AnalyticsConsent from "@/components/analytics-consent";
import SiteSchema from "@/components/site-schema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Internet Toolbox | Free online tools for everyday tasks", template: "%s | Internet Toolbox" },
  description: "Free online calculators, converters, text tools and file utilities for everyday tasks. Fast, clear and no account required.",
  applicationName: "Internet Toolbox",
  keywords: ["online tools", "free calculators", "unit converter", "percentage calculator", "EMI calculator", "GST calculator", "text tools", "developer tools", "image compressor"],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  alternates: { canonical: "/" },
  verification: googleVerification ? { google: googleVerification } : undefined,
  openGraph: { type: "website", siteName: "Internet Toolbox", title: "Internet Toolbox | Free online tools for everyday tasks", description: "Free online calculators, converters, text tools and file utilities for everyday tasks. Fast, clear and no account required.", url: siteUrl, images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Internet Toolbox: free online tools for everyday tasks" }] },
  twitter: { card: "summary_large_image", title: "Internet Toolbox | Free online tools for everyday tasks", description: "Free online calculators, converters, text tools and file utilities for everyday tasks.", images: ["/og-image.svg"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="min-w-0 overflow-x-clip"><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-[#171717] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Skip to main content</a><SiteSchema /><div id="main-content" tabIndex={-1}>{children}</div><AnalyticsConsent /></body></html>;
}
