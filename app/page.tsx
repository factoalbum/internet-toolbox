import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ToolSearch from "@/components/tool-search";
import SiteHeader from "@/components/site-header";
import { categories, tools } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";
export const metadata: Metadata = { title: "Internet Toolbox | Simple Free Online Tools", description: "Simple free online calculators, converters, text tools, developer utilities and file tools. Find a tool, use it, done.", alternates: { canonical: `${siteUrl}/` }, openGraph: { type: "website", title: "Internet Toolbox | Simple Free Online Tools", description: "Simple free online calculators, converters, text tools, developer utilities and file tools.", url: `${siteUrl}/` }, twitter: { card: "summary_large_image", title: "Internet Toolbox | Simple Free Online Tools", description: "Simple free online calculators, converters, text tools, developer utilities and file tools." } };
const categoryOrder = ["calculators", "everyday", "text", "developer", "files"];
const categoryCopy: Record<string, string> = { calculators: "Money, tax, loans and investments", everyday: "Dates, time, units and quick conversions", text: "Count, clean, change and compare text", developer: "Small helpers for code and data", files: "Compress and work with files in your browser" };

export default function Home() {
  const liveTools = tools.filter((tool) => tool.status === "live");
  const popularSlugs = ["percentage-calculator", "age-calculator", "emi-calculator", "gst-calculator", "word-counter", "json-formatter", "password-generator", "image-compressor"];
  const popular = popularSlugs.map((slug) => liveTools.find((tool) => tool.slug === slug)).filter(Boolean);
  return <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
    <SiteHeader sticky />
    <section className="bg-[#faf9f6]">
      <div className="container py-14 text-center md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dedbd3] bg-white px-4 py-2 text-xs font-semibold text-black/55"><Sparkles size={14} className="text-[#6d8e25]" aria-hidden="true" />{liveTools.length}+ free tools</div>
          <h1 className="mt-7 text-5xl font-black tracking-[-0.055em] md:text-7xl md:leading-[1.02]">Find a tool.<br className="hidden sm:block" /> Get it done.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Calculators, converters, text tools, developer helpers and file utilities, all in one simple place.</p>
          <div className="mx-auto mt-8 max-w-2xl text-left"><label htmlFor="tool-search" className="mb-2 block px-1 text-xs font-bold text-black/40">What do you need?</label><ToolSearch /></div>
          <p className="mt-3 text-xs text-black/35">Try “loan”, “tax”, “JSON”, “image”, “password” or “time zone”.</p>
        </div>
      </div>
    </section>

    <section className="border-y border-[#e4e1d9] bg-white" aria-labelledby="categories-heading">
      <div className="container py-10 md:py-14">
        <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold text-[#6d8e25]">BROWSE</p><h2 id="categories-heading" className="mt-1 text-2xl font-black md:text-3xl">Choose a category</h2></div><Link href="/tools" className="inline-flex items-center gap-2 text-sm font-bold">All tools <ArrowRight size={15} /></Link></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{categoryOrder.map((slug) => { const category = categories.find((item) => item.slug === slug); if (!category) return null; const Icon = category.icon; const count = liveTools.filter((tool) => tool.category === slug).length; return <Link key={slug} href={`/categories/${slug}`} className="group rounded-2xl border border-[#e1ded6] bg-[#faf9f6] p-5 transition hover:-translate-y-0.5 hover:border-[#171717] hover:shadow-[0_8px_24px_rgba(23,23,23,.08)] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><span className="flex size-11 items-center justify-center rounded-xl bg-[#e9f4cf] text-[#425515]"><Icon size={20} aria-hidden="true" /></span><h3 className="mt-5 font-extrabold">{category.name}</h3><p className="mt-1.5 text-xs leading-5 text-black/50">{categoryCopy[slug]}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#6d8e25]">{count} tools <ArrowRight size={12} /></span></Link>; })}</div>
      </div>
    </section>

    <section className="container py-12 md:py-16" aria-labelledby="popular-heading">
      <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold text-[#6d8e25]">POPULAR</p><h2 id="popular-heading" className="mt-1 text-2xl font-black md:text-3xl">Popular tools</h2><p className="mt-2 text-sm text-black/45">Jump straight into something useful.</p></div><Link href="/tools" className="hidden items-center gap-2 text-sm font-bold sm:inline-flex">View all <ArrowRight size={15} /></Link></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{popular.map((tool) => { if (!tool) return null; const Icon = tool.icon; return <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex min-h-36 flex-col rounded-2xl border border-[#e1ded6] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#171717] hover:shadow-[0_10px_28px_rgba(23,23,23,.08)] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><div className="flex items-center justify-between"><span className="flex size-10 items-center justify-center rounded-xl bg-[#f0eee8]"><Icon size={19} aria-hidden="true" /></span><ArrowRight size={15} className="text-black/20 transition group-hover:translate-x-1 group-hover:text-black" aria-hidden="true" /></div><h3 className="mt-auto pt-5 text-sm font-extrabold">{tool.name}</h3><p className="mt-1 text-xs text-black/45 line-clamp-1">{tool.description}</p></Link>; })}</div>
    </section>

    <section className="border-y border-[#e4e1d9] bg-[#f2f0ea]" aria-labelledby="simple-heading"><div className="container py-12 md:py-16"><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold text-[#6d8e25]">MADE TO BE EASY</p><h2 id="simple-heading" className="mt-2 text-3xl font-black">Open. Do the thing. Done.</h2><p className="mt-3 text-sm leading-6 text-black/50">No account, no dashboard and no confusing setup. Pick a tool, follow the obvious inputs and get your answer.</p></div></div></section>
    <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-5 py-9 text-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">Internet Toolbox</p><p className="mt-1 text-xs text-white/35">Small tools. Less hassle.</p></div><div className="flex flex-wrap gap-x-5 gap-y-2 text-white/50"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
  </main>;
}
