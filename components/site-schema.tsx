const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export default function SiteSchema() {
  const structuredData = [
    { "@context": "https://schema.org", "@type": "WebSite", name: "Internet Toolbox", url: `${siteUrl}/` },
    { "@context": "https://schema.org", "@type": "Organization", name: "Internet Toolbox", url: `${siteUrl}/`, logo: `${siteUrl}/icon.svg` },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />;
}
