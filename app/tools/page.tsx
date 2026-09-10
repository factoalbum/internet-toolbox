import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import AllToolsBrowser from "@/components/all-tools-browser";
import SiteHeader from "@/components/site-header";
import { categories, tools } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export const metadata = {
  title: "All Tools | Internet Toolbox",
  description: "Browse simple free calculators, converters, text tools, developer utilities and file tools.",
  alternates: { canonical: `${siteUrl}/tools` },
  openGraph: { title: "All Tools | Internet Toolbox", description: "Browse simple free calculators, converters, text tools, developer utilities and file tools.", url: `${siteUrl}/tools`, type: "website" },
  twitter: { card: "summary", title: "All Tools | Internet Toolbox", description: "Browse simple free calculators, converters, text tools, developer utilities and file tools." },
};

const toolListJsonLd = { "@context": "https://schema.org", "@type": "ItemList", name: "Internet Toolbox - All Tools", description: "Free online calculators, converters, developer utilities, text tools and file tools.", numberOfItems: tools.length, itemListElement: tools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: `${siteUrl}/tools/${tool.slug}/` })) };

export default function ToolsPage() {
  return <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolListJsonLd) }} />
    <SiteHeader />
    <section className="bg-[#faf9f6]">
      <div className="container py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-black/40"><Link href="/" className="hover:text-black hover:underline">Home</Link><span className="mx-2">/</span><span className="font-semibold text-black">All tools</span></nav>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold text-[#6d8e25]">THE TOOLBOX</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] md:text-6xl">Find the tool you need.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-black/50 md:text-base">Search by name or choose a category. No complicated menus.</p>
        </div>
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#d9d5cc] bg-white p-2 shadow-[0_8px_24px_rgba(23,23,23,.06)]">
          <div className="flex items-center gap-3 px-3 pb-2 pt-2 text-xs font-bold text-black/40"><Search size={15} aria-hidden="true" /> Search all tools</div>
          <AllToolsBrowser />
        </div>
      </div>
    </section>
    <section className="border-t border-[#e4e1d9] bg-white" aria-labelledby="category-links">
      <div className="container py-10 md:py-14"><div className="flex items-center justify-between"><h2 id="category-links" className="text-xl font-black">Browse by category</h2><Link href="/" className="hidden items-center gap-2 text-sm font-bold sm:inline-flex">Home <ArrowRight size={14} /></Link></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{categories.map((category) => <Link key={category.slug} href={`/categories/${category.slug}`} className="group rounded-2xl border border-[#e1ded6] bg-[#faf9f6] p-4 transition hover:border-[#171717] hover:shadow-[0_7px_20px_rgba(23,23,23,.07)] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><div className="flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-xl bg-[#e9f4cf]"><category.icon size={17} aria-hidden="true" /></span><ArrowRight size={14} className="text-black/20 transition group-hover:translate-x-1 group-hover:text-black" aria-hidden="true" /></div><p className="mt-4 text-sm font-bold">{category.name}</p><p className="mt-1 text-xs text-black/45">{category.description}</p></Link>)}</div></div>
    </section>
    <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/50"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/" className="hover:text-white">Home</Link></div></div></footer>
  </main>;
}
