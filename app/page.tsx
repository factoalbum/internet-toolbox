import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import ToolSearch from "@/components/tool-search";
import SiteHeader from "@/components/site-header";
import { categories, tools } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export const metadata: Metadata = {
  title: "Internet Toolbox | Free Online Tools for Everyday Tasks",
  description: "Free online calculators, converters, text tools, developer utilities and file tools in one simple toolbox.",
  alternates: { canonical: `${siteUrl}/` },
  openGraph: { type: "website", title: "Internet Toolbox | Free Online Tools for Everyday Tasks", description: "Free online calculators, converters, text tools, developer utilities and file tools in one simple toolbox.", url: `${siteUrl}/` },
  twitter: { card: "summary_large_image", title: "Internet Toolbox | Free Online Tools for Everyday Tasks", description: "Free online calculators, converters, text tools, developer utilities and file tools in one simple toolbox." },
};

const categoryOrder = ["calculators", "everyday", "text", "developer", "files"];
const categoryCopy: Record<string, string> = {
  calculators: "Money, loans, tax and investment calculations.",
  everyday: "Dates, time, units, conversions and quick answers.",
  text: "Clean, count, compare and transform text in seconds.",
  developer: "Small coding utilities for debugging and development.",
  files: "Useful browser-based tools for images and files.",
};

export default function Home() {
  const liveTools = tools.filter((tool) => tool.status === "live");
  return (
    <main className="min-h-screen overflow-x-clip bg-[#fffdf8] text-[#171717]">
      <SiteHeader sticky />

      <section className="border-b border-[#dedbd3] bg-[#f3f0e8]">
        <div className="container py-16 text-center md:py-24 lg:py-28">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#66812b]">Free tools. One place.</p>
            <h1 className="mt-5 text-5xl font-black tracking-[-0.06em] md:text-7xl lg:text-[84px] lg:leading-[.95]">All the little tools<br className="hidden sm:block" /> you need online.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Calculators, converters, text utilities, developer helpers and file tools — simple enough to use without a manual.</p>

            <div className="mx-auto mt-9 max-w-2xl text-left">
              <div className="mb-2 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-[0.14em] text-black/40"><Search size={14} aria-hidden="true" />Find a tool</div>
              <div className="border border-[#171717] bg-white p-2 shadow-[5px_5px_0_#171717]"><ToolSearch /></div>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-black/45">
              <span>{liveTools.length}+ tools</span><span>Free to use</span><span>No account required</span><span>Browser-first</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20" aria-labelledby="categories-heading">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/35">Explore</p><h2 id="categories-heading" className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Tool categories</h2></div>
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-bold hover:underline">Browse all tools <ArrowRight size={15} /></Link>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categoryOrder.map((slug) => {
            const category = categories.find((item) => item.slug === slug);
            if (!category) return null;
            const Icon = category.icon;
            const count = liveTools.filter((tool) => tool.category === slug).length;
            return <Link key={slug} href={`/categories/${slug}`} className="group min-w-0 rounded-xl border border-[#dedbd3] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#171717] hover:shadow-[5px_5px_0_#c8f169] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
              <span className="flex size-10 items-center justify-center rounded-lg bg-[#eef6da]"><Icon size={19} aria-hidden="true" /></span>
              <h3 className="mt-6 text-base font-extrabold">{category.name}</h3>
              <p className="mt-2 min-h-10 text-xs leading-5 text-black/50">{categoryCopy[slug]}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-black/45">{count} tools <ArrowRight size={12} className="transition group-hover:translate-x-1" /></span>
            </Link>;
          })}
        </div>
      </section>

      <section className="border-y border-[#dedbd3] bg-[#f3f0e8]" aria-labelledby="popular-heading">
        <div className="container py-14 md:py-20">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/35">Start here</p><h2 id="popular-heading" className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Popular tools</h2><p className="mt-2 text-sm text-black/50">A few of the things people come here to do.</p></div>
            <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-bold hover:underline">See all <ArrowRight size={15} /></Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {liveTools.slice(0, 8).map((tool) => { const Icon = tool.icon; return <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group min-w-0 rounded-xl border border-[#dedbd3] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#171717] hover:shadow-[5px_5px_0_#c8f169] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
              <div className="flex items-center justify-between gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-[#f3f0e8]"><Icon size={18} aria-hidden="true" /></span><ArrowRight size={14} className="text-black/25 transition group-hover:translate-x-1 group-hover:text-black" /></div>
              <h3 className="mt-6 break-words text-sm font-extrabold">{tool.name}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-black/50">{tool.description}</p>
            </Link>; })}
          </div>
        </div>
      </section>

      {categoryOrder.map((slug) => {
        const category = categories.find((item) => item.slug === slug);
        const categoryTools = liveTools.filter((tool) => tool.category === slug).slice(0, 7);
        if (!category || categoryTools.length === 0) return null;
        return <section key={slug} className="container py-12 md:py-16" aria-labelledby={`${slug}-tools-heading`}>
          <div className="flex items-end justify-between gap-4 border-b border-[#dedbd3] pb-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">{category.name}</p><h2 id={`${slug}-tools-heading`} className="mt-1 text-2xl font-black tracking-tight">More {category.name.toLowerCase()}</h2></div><Link href={`/categories/${slug}`} className="hidden items-center gap-2 text-xs font-bold sm:inline-flex">See all <ArrowRight size={13} /></Link></div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {categoryTools.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex min-w-0 items-center gap-3 rounded-lg border border-[#dedbd3] bg-white px-4 py-4 transition hover:border-[#171717] hover:bg-[#f7f5ef] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#eef6da]"><tool.icon size={16} aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block break-words text-sm font-bold">{tool.name}</span><span className="mt-0.5 block truncate text-[11px] text-black/40">{tool.description}</span></span><ArrowRight size={13} className="shrink-0 text-black/20 transition group-hover:translate-x-1 group-hover:text-black" /></Link>)}
          </div>
          <Link href={`/categories/${slug}`} className="mt-4 inline-flex items-center gap-2 text-xs font-bold sm:hidden">See all {category.name.toLowerCase()} <ArrowRight size={13} /></Link>
        </section>;
      })}

      <section className="border-t border-[#dedbd3] bg-[#171717] text-white">
        <div className="container py-12 md:py-16"><div className="mx-auto max-w-3xl text-center"><ShieldCheck size={23} className="mx-auto text-[#c8f169]" aria-hidden="true" /><h2 className="mt-4 text-2xl font-black tracking-tight">Simple by design.</h2><p className="mt-3 text-sm leading-6 text-white/55">No account walls. No complicated dashboards. Just open a tool, do the task and move on. Tools that can run locally stay in your browser whenever practical.</p></div></div>
      </section>

      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 border-t border-white/10 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/50"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
    </main>
  );
}
