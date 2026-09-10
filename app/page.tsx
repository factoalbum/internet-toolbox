import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Code2, Heart, Image as ImageIcon, Menu, Search, ShieldCheck, Type, Users, Zap } from "lucide-react";
import ToolSearch from "@/components/tool-search";
import SiteHeader from "@/components/site-header";
import HomeIllustration from "@/components/home-illustration";
import { categories, tools } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";
export const metadata: Metadata = { title: "Internet Toolbox | Simple Free Online Tools", description: "Simple free online calculators, converters, text tools, developer utilities and file tools. Find a tool, use it, done.", alternates: { canonical: `${siteUrl}/` }, openGraph: { type: "website", title: "Internet Toolbox | Simple Free Online Tools", description: "Simple free online calculators, converters, text tools, developer utilities and file tools.", url: `${siteUrl}/` }, twitter: { card: "summary_large_image", title: "Internet Toolbox | Simple Free Online Tools", description: "Simple free online calculators, converters, text tools, developer utilities and file tools." } };

const categoryOrder = ["calculators", "everyday", "text", "developer", "files"];
const categoryIcons = [Code2, Type, ImageIcon, ShieldCheck, Zap];

export default function Home() {
  const liveTools = tools.filter((tool) => tool.status === "live");
  const popularSlugs = ["developer-file-viewer", "json-formatter", "image-compressor", "word-counter", "unit-converter", "password-generator", "url-encoder-decoder", "percentage-calculator"];
  const popular = popularSlugs.map((slug) => liveTools.find((tool) => tool.slug === slug)).filter(Boolean);
  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9f6] text-[#101522]">
      <SiteHeader sticky />

      <section className="relative bg-[#faf9f6]">
        <div className="container pt-7 sm:pt-9 md:pt-12 lg:pt-14">
          <div className="grid items-center gap-5 sm:gap-8 lg:grid-cols-[1.03fr_.97fr] lg:gap-4">
            <div className="order-2 lg:order-1"><HomeIllustration /></div>
            <div className="order-1 pb-1 lg:order-2 lg:pb-8">
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#66758f] sm:text-xs">Simple tools for a faster internet</p>
              <h1 className="display-heading mt-3 max-w-3xl text-[clamp(2.55rem,11vw,5.4rem)] leading-[.98] sm:mt-4">Every online tool<br />you need, <span className="relative inline-block px-1"><span className="absolute inset-x-0 bottom-[7%] -z-0 h-[42%] rounded-sm bg-[#c8f169]" /><span className="relative">in one place.</span></span></h1>
              <p className="mt-5 max-w-xl text-[15px] leading-6 text-[#58657b] sm:mt-6 sm:text-base sm:leading-7 md:text-lg">Free, fast and easy-to-use tools for developers, creators, students and everyone. No sign up. No limits. Just tools.</p>
              <div className="mt-6 flex flex-col gap-2.5 min-[480px]:flex-row sm:mt-7">
                <Link href="/tools" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#101522] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(16,21,34,.16)] transition hover:-translate-y-0.5 hover:bg-[#1c2434] focus:outline-none focus:ring-4 focus:ring-[#c8f169] min-[480px]:flex-none"><Search size={18} />Browse all tools<ArrowRight size={16} /></Link>
                <Link href="/categories/developer" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#dedbd3] bg-white px-5 text-sm font-bold transition hover:-translate-y-0.5 hover:border-[#101522] focus:outline-none focus:ring-4 focus:ring-[#c8f169] min-[480px]:flex-none"><Menu size={18} />Explore categories</Link>
              </div>
              <div className="mt-7 grid grid-cols-3 gap-2 sm:mt-8 sm:max-w-2xl sm:gap-4">
                <div className="flex items-start gap-1.5 sm:gap-2"><Zap className="mt-0.5 shrink-0 text-[#f3b51b]" size={21} /><div><p className="text-xs font-black sm:text-sm">{liveTools.length}+</p><p className="text-[10px] leading-4 text-[#66758f] sm:text-xs">Free tools</p></div></div>
                <div className="flex items-start gap-1.5 sm:gap-2"><Users className="mt-0.5 shrink-0 text-[#6555ee]" size={21} /><div><p className="text-xs font-black sm:text-sm">No sign up</p><p className="text-[10px] leading-4 text-[#66758f] sm:text-xs">Use instantly</p></div></div>
                <div className="flex items-start gap-1.5 sm:gap-2"><Heart className="mt-0.5 shrink-0 text-[#ef476f]" size={21} /><div><p className="text-xs font-black sm:text-sm">Built for everyone</p><p className="text-[10px] leading-4 text-[#66758f] sm:text-xs">Developers, creators & more</p></div></div>
              </div>
            </div>
          </div>
          <div className="relative z-10 mx-auto mt-5 max-w-6xl sm:mt-3 sm:translate-y-5"><ToolSearch /></div>
        </div>
      </section>

      <section className="container pb-4 pt-12 md:pt-16" aria-labelledby="category-heading">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#71809a]">Browse</p><h2 id="category-heading" className="mt-1 text-2xl font-black md:text-3xl">Find the right tool</h2></div><Link href="/tools" className="hidden items-center gap-2 text-sm font-bold sm:inline-flex">View all tools <ArrowRight size={15} /></Link></div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link href="/tools" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#101522] px-5 py-3 text-sm font-bold text-white">All</Link>
          {categoryOrder.map((slug, index) => { const category = categories.find((item) => item.slug === slug); if (!category) return null; const Icon = categoryIcons[index]; return <Link key={slug} href={`/categories/${slug}`} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#dedbd3] bg-white px-5 py-3 text-sm font-bold text-[#293247] transition hover:border-[#101522] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><Icon size={16} />{category.name}</Link>; })}
        </div>
      </section>

      <section className="container py-8 md:py-12" aria-labelledby="popular-heading">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#71809a]">Popular tools</p><h2 id="popular-heading" className="mt-1 text-2xl font-black md:text-3xl">The tools people use most</h2></div><Link href="/tools" className="inline-flex items-center gap-2 text-sm font-bold">View all tools <ArrowRight size={15} /></Link></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{popular.map((tool) => { if (!tool) return null; const Icon = tool.icon; return <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex min-h-[118px] items-center gap-4 rounded-2xl border border-[#dedbd3] bg-white p-4 shadow-[0_3px_12px_rgba(23,23,23,.025)] transition hover:-translate-y-0.5 hover:border-[#bdb9af] hover:shadow-[0_12px_28px_rgba(23,23,23,.07)] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#eef7d8] text-[#4e6b18]"><Icon size={24} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-black">{tool.name}</span><span className="mt-1 block line-clamp-2 text-xs leading-5 text-[#66758f]">{tool.description}</span></span><ArrowRight size={17} className="shrink-0 text-[#7d8799] transition group-hover:translate-x-1 group-hover:text-[#101522]" /></Link>; })}</div>
      </section>

      <section className="border-y border-[#e3e0d8] bg-[#f2f0ea]" aria-labelledby="easy-heading"><div className="container py-12 md:py-16"><div className="mx-auto max-w-3xl text-center"><span className="inline-flex items-center gap-2 rounded-full border border-[#ddd9d0] bg-white px-3 py-1.5 text-xs font-bold text-[#58657b]"><Check size={14} className="text-[#5c7b1d]" />Everything runs in your browser</span><h2 id="easy-heading" className="mt-4 text-3xl font-black md:text-4xl">Small tools. Big possibilities.</h2><p className="mt-3 text-sm leading-6 text-[#667085]">Pick a tool, do the tiny task you came for, and move on. No account, no complicated setup.</p></div></div></section>
      <footer className="bg-[#101522] text-white"><div className="container flex flex-col gap-5 py-9 text-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">Internet Toolbox</p><p className="mt-1 text-xs text-white/40">Small tools. Less hassle.</p></div><div className="flex flex-wrap gap-x-5 gap-y-2 text-white/50"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
    </main>
  );
}
