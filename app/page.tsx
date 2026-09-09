import Link from "next/link";
import { ArrowRight, Calculator, Clock3, FileImage, Search, Sparkles, Wrench } from "lucide-react";
import ToolSearch from "@/components/tool-search";
import { categories, featuredTools, tools } from "@/lib/tools";

const quickToolSlugs = [
  "percentage-calculator",
  "discount-calculator",
  "emi-calculator",
  "gst-calculator",
  "currency-converter",
  "unit-converter",
];

const quickTools = quickToolSlugs
  .map(slug => tools.find(tool => tool.slug === slug))
  .filter((tool): tool is (typeof tools)[number] => Boolean(tool));

const taskCards = [
  { label: "Money", text: "EMI, GST, salary, tax and investment estimates.", href: "/categories/calculators", icon: Calculator },
  { label: "Everyday", text: "Age, dates, time, percentages and conversions.", href: "/categories/calculators", icon: Clock3 },
  { label: "Files", text: "Compress images and handle common file tasks locally.", href: "/categories/files", icon: FileImage },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <header className="sticky top-0 z-20 border-b border-[#d8d4c9] bg-[#f3f0e8]/95 backdrop-blur">
        <div className="container flex h-[68px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Internet Toolbox home">
            <span className="flex size-8 items-center justify-center border border-[#171717] bg-[#171717] text-xs font-bold text-white" aria-hidden="true">IT</span>
            <span className="text-[15px] font-semibold tracking-[-0.01em]">Internet Toolbox</span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <Link href="/tools" className="rounded-md px-3 py-2 text-sm font-medium text-black/60 transition hover:bg-black/5 hover:text-[#171717]">All tools</Link>
            <Link href="#tools" className="hidden rounded-md px-3 py-2 text-sm font-medium text-black/60 transition hover:bg-black/5 hover:text-[#171717] sm:inline-flex">Popular</Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#d8d4c9] bg-[#e8e4d9]">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(23,23,23,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,23,.06)_1px,transparent_1px)] [background-size:32px_32px]" aria-hidden="true" />
        <div className="container relative grid gap-10 py-12 md:grid-cols-[1.15fr_.85fr] md:items-center md:py-20">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-black/50">
              <span className="inline-flex items-center gap-2 border border-black/10 bg-[#f3f0e8]/70 px-3 py-1.5"><Sparkles size={13} aria-hidden="true" /> Simple tools. No fuss.</span>
              <span className="font-mono text-black/30">{tools.length} tools and growing</span>
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.06em] md:text-7xl lg:text-8xl">Find it.<br /><span className="text-[#5f7429]">Do it. Move on.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Useful calculators, converters and small internet utilities for the things you need to get done every day.</p>
          </div>

          <div className="border border-[#171717] bg-[#fffdf8] p-4 shadow-[8px_8px_0_#171717] md:p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div><p className="font-bold">What are you trying to do?</p><p className="mt-1 text-xs text-black/45">Search by task, not by tool name.</p></div>
              <Search size={18} className="text-black/35" aria-hidden="true" />
            </div>
            <ToolSearch />
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Quick tool suggestions">
              {quickTools.slice(0, 5).map(tool => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="rounded-full border border-[#d8d4c9] bg-[#f3f0e8] px-3 py-2 text-xs font-semibold text-black/60 transition hover:border-[#171717] hover:bg-[#c8f169] hover:text-[#171717]">{tool.name.replace(" Calculator", "")}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="container py-14 md:py-20">
        <div className="mb-7 flex items-end justify-between border-b border-[#d8d4c9] pb-4">
          <div><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">01 / Start here</p><h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Popular everyday tools</h2></div>
          <Link href="/tools" className="hidden items-center gap-2 text-sm font-bold sm:inline-flex">See all <ArrowRight size={15} /></Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool, index) => {
            const Icon = tool.icon;
            return <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group relative min-h-52 overflow-hidden border border-[#d8d4c9] bg-[#fffdf8] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#171717] hover:shadow-[7px_7px_0_#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
              <div className="flex items-start justify-between gap-4"><span className="font-mono text-xs text-black/30">{String(index + 1).padStart(2, "0")}</span><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#edf7d5] text-[#171717]"><Icon size={20} aria-hidden="true" /></span></div>
              <div className="absolute bottom-5 left-5 right-5"><h3 className="text-lg font-bold tracking-tight">{tool.name}</h3><p className="mt-1.5 line-clamp-2 text-sm leading-5 text-black/50">{tool.description}</p><span className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">Open <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></div>
            </Link>;
          })}
        </div>
        <Link href="/tools" className="mt-4 flex min-h-12 items-center justify-center gap-2 border border-[#d8d4c9] bg-[#fffdf8] text-sm font-bold transition hover:border-[#171717] hover:bg-[#c8f169] sm:hidden">Browse all tools <ArrowRight size={15} /></Link>
      </section>

      <section className="border-y border-[#d8d4c9] bg-[#171717] text-white">
        <div className="container py-12 md:py-16">
          <div className="mb-7 flex items-end justify-between gap-6"><div><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/35">02 / Common tasks</p><h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Pick a task. Get the shortcut.</h2></div><Wrench className="hidden text-[#c8f169] sm:block" size={28} aria-hidden="true" /></div>
          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
            {taskCards.map(({ label, text, href, icon: Icon }) => <Link key={label} href={href} className="group bg-[#202020] p-6 transition hover:bg-[#c8f169] hover:text-[#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169] focus:ring-inset"><div className="flex items-center justify-between"><span className="flex size-9 items-center justify-center border border-white/10 bg-white/5 group-hover:border-black/10 group-hover:bg-black/5"><Icon size={18} aria-hidden="true" /></span><ArrowRight size={16} className="opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100" /></div><p className="mt-7 text-xs font-bold uppercase tracking-[0.15em] opacity-45">{label}</p><p className="mt-2 text-lg font-bold leading-6">{text}</p></Link>)}
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="grid gap-8 md:grid-cols-[.65fr_1.35fr]">
          <div><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">03 / Browse</p><h2 className="mt-3 max-w-sm text-3xl font-black tracking-tight md:text-4xl">More useful things, neatly sorted.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-black/50">No hunting through a giant list. Choose a category and jump straight to the kind of task you need.</p></div>
          <div className="grid gap-px overflow-hidden border border-[#d8d4c9] bg-[#d8d4c9] sm:grid-cols-2">{categories.map(category => { const Icon = category.icon; return <Link key={category.slug} href={`/categories/${category.slug}`} className="group bg-[#fffdf8] p-6 transition hover:bg-[#c8f169] focus:outline-none focus:ring-4 focus:ring-[#171717] focus:ring-inset"><div className="flex items-center justify-between"><Icon size={20} aria-hidden="true" /><ArrowRight size={16} className="opacity-30 transition group-hover:translate-x-1 group-hover:opacity-100" /></div><h3 className="mt-8 font-bold">{category.name}</h3><p className="mt-2 text-sm leading-6 text-black/50">{category.description}</p></Link>; })}</div>
        </div>
      </section>

      <section className="border-t border-[#d8d4c9] bg-[#e8e4d9]">
        <div className="container grid gap-8 py-12 md:grid-cols-3 md:py-16">
          {[["FAST", "Lightweight tools built to get you from question to answer quickly."], ["PRIVATE", "Browser-side processing whenever a task can safely stay on your device."], ["CLEAR", "Plain language, useful defaults and controls that work on every screen."]].map(([title, text]) => <div key={title} className="border-t-2 border-[#171717] pt-4"><p className="font-mono text-xs font-bold tracking-[0.16em]">{title}</p><p className="mt-3 max-w-sm text-sm leading-6 text-black/55">{text}</p></div>)}
        </div>
      </section>

      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
    </main>
  );
}
