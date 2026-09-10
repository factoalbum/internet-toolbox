import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import AllToolsBrowser from "@/components/all-tools-browser";
import SiteHeader from "@/components/site-header";
import { categories, tools } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export const metadata = {
  title: "All Tools | Internet Toolbox",
  description: "Browse and search every free calculator, converter, developer utility, text tool and file tool in Internet Toolbox.",
  alternates: { canonical: `${siteUrl}/tools` },
  openGraph: { title: "All Tools | Internet Toolbox", description: "Browse and search every free calculator, converter, developer utility, text tool and file tool in Internet Toolbox.", url: `${siteUrl}/tools`, type: "website" },
  twitter: { card: "summary", title: "All Tools | Internet Toolbox", description: "Browse and search every free calculator, converter, developer utility, text tool and file tool in Internet Toolbox." },
};

const toolListJsonLd = { "@context": "https://schema.org", "@type": "ItemList", name: "Internet Toolbox - All Tools", description: "Free online calculators, converters, developer utilities, text tools and file tools.", numberOfItems: tools.length, itemListElement: tools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: `${siteUrl}/tools/${tool.slug}/` })) };

export default function ToolsPage() {
  return <main className="min-h-screen overflow-x-clip bg-[#fffdf8] text-[#171717]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolListJsonLd) }} />
    <SiteHeader />
    <section className="border-b border-[#dedbd3] bg-[#f3f0e8]">
      <div className="container py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-7 text-xs text-black/45"><Link href="/" className="hover:text-black hover:underline">Home</Link><span className="mx-2">/</span><span className="font-semibold text-black">All tools</span></nav>
        <div className="max-w-3xl"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#66812b]">The toolbox</p><h1 className="mt-3 text-5xl font-black tracking-[-0.055em] md:text-7xl">Everything you need.<br /><span className="text-[#66812b]">One place.</span></h1><p className="mt-5 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Search by tool name or browse a category. Every tool is designed to get you to the useful part quickly.</p></div>
        <div className="mt-8 flex flex-wrap gap-2" aria-label="Tool categories">
          {categories.map((category) => <Link key={category.slug} href={`/categories/${category.slug}`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#cfcac0] bg-white px-4 text-xs font-bold transition hover:border-[#171717] hover:bg-[#171717] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><category.icon size={14} aria-hidden="true" />{category.name}<ArrowRight size={12} aria-hidden="true" /></Link>)}
        </div>
      </div>
    </section>
    <section className="container py-10 md:py-16" aria-labelledby="tool-library-heading">
      <div className="mb-7 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-black/35"><Search size={14} aria-hidden="true" />Search the toolbox</div>
      <h2 id="tool-library-heading" className="sr-only">Browse all Internet Toolbox tools</h2>
      <AllToolsBrowser />
    </section>
    <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/" className="hover:text-white">Home</Link></div></div></footer>
  </main>;
}
