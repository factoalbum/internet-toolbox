import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://internet-toolbox.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Internet Toolbox — Simple tools for everyday tasks",
    template: "%s | Internet Toolbox",
  },
  description: "Fast, simple and free online tools, calculators, converters and utilities for everyday digital tasks.",
  applicationName: "Internet Toolbox",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Internet Toolbox",
    title: "Internet Toolbox — Simple tools for everyday tasks",
    description: "Fast, simple and free online tools for everyday digital tasks.",
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
