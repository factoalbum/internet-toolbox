import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://internet-toolbox.example.com"),
  title: {
    default: "Internet Toolbox — Simple tools for everyday tasks",
    template: "%s | Internet Toolbox",
  },
  description:
    "Fast, simple and free online tools, calculators, converters and utilities. No signup, no friction.",
  applicationName: "Internet Toolbox",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Internet Toolbox",
    title: "Internet Toolbox — Simple tools for everyday tasks",
    description: "Fast, simple and free online tools for everyday digital tasks.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
