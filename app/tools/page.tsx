import Link from "next/link";
import AllToolsBrowser from "@/components/all-tools-browser";
import SiteHeader from "@/components/site-header";
import { categories, tools } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export const metadata = {
  title: "All Tools",
  description: "Browse and search every free calculator, converter, developer utility, text tool and file tool in Internet Toolbox.",
  alternates: { canonical: `${siteUrl}/tools` },
  openGraph: {
    title: "All Tools | Internet Toolbox",
    description: "Browse and search every free calculator, converter, developer utility, text tool and file tool in Internet Toolbox.",
    url: `${siteUrl}/tools`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "All Tools | Internet Toolbox",
    description: "Browse and search every free calculator, converter, developer utility, text tool and file tool in Internet Toolbox.",
  },
};

const toolListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Internet Toolbox - All Tools",
  description: "Free online calculators, converters, developer utilities, text tools and file tools.",
  numberOfItems: tools.length,
  itemListElement: tools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tool.name,
    url: `${siteUrl}/tools/${tool.slug}/`,
  })),
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f0e8] text-[#171717]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolListJsonLd) }} />
      <SiteHeader />
      <section className="border-b border-[#d8d4c9] bg-[#e8e4d9] py-14 md:py-20">
        <div className="container">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Tool library</p>
          <h1 className="mt-4 max-w-4xl break-words text-5xl font-black tracking-[-0.045em] md:text-7xl">Every tool.<br /><span className="text-[#5f7429]">One place.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Browse the full library or search for the task you need.</p>
          <div className="mt-7 flex flex-wrap gap-2" aria-label="Tool categories">
            {categories.map((category) => <Link key={category.slug} href={`/categories/${category.slug}`} className="min-h-11 rounded-full border border-[#c8c3b7] bg-[#fffdf8] px-4 py-2 text-sm font-semibold transition hover:border-[#171717] hover:bg-[#171717] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">{category.name}</Link>)}
          </div>
        </div>
      </section>
      <section className="container py-14 md:py-20" aria-labelledby="tool-library-heading">
        <h2 id="tool-library-heading" className="sr-only">Browse all Internet Toolbox tools</h2>
        <AllToolsBrowser />
      </section>
      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/" className="hover:text-white">Home</Link></div></div></footer>
    </main>
  );
}
