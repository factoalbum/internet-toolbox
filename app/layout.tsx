import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Internet Toolbox — Free online tools for everyday tasks",
    template: "%s | Internet Toolbox",
  },
  description: "Fast, simple and free online tools, calculators, converters and utilities for everyday digital tasks. No signup required.",
  applicationName: "Internet Toolbox",
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    siteName: "Internet Toolbox",
    title: "Internet Toolbox — Free online tools for everyday tasks",
    description: "Fast, simple and free online tools for everyday digital tasks. No signup required.",
    url: siteUrl,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
