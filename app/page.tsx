import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ToolSearch from "@/components/tool-search";
import { categories, featuredTools } from "@/lib/tools";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <header className="bg-[#171717] text-white">
        <div className="container flex h-[72px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Internet Toolbox home">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#c8f169] text-[#171717]"><Sparkles size={18} /></span>
            <span className="font-bold tracking-tight">Internet Toolbox</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
            <span className="hidden sm:inline">Free utilities</span>
            <span className="size-1 rounded-full bg-[#c8f169]" />
            <Link href="/tools" className="rounded-lg px-3 py-2 text-white transition hover:bg-white/10">All tools</Link>
          </div>
        </div>
      </header>

      <section className="bg-[#171717] pb-14 text-white md:pb-20">
        <div className="container grid gap-10 pt-14 md:grid-cols-[1.35fr_.65fr] md:items-end md:pt-20">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#c8f169]">
              <span className="size-1.5 rounded-full bg-[#c8f169]" /> No signup. No nonsense.
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl lg:text-8xl">Small tools.<br /><span className="text-[#c8f169]">Big time saved.</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/60 md:text-lg">A growing collection of sharp, useful utilities for calculations, text, code, files and everyday internet work.</p>
          </div>
          <div className="md:pb-1">
            <p className="mb-3 text-right font-mono text-xs text-white/35">01 / TOOL INDEX</p>
            <ToolSearch />
            <p className="mt-3 text-right text-xs text-white/35">Try: percentage · JSON · word count · UUID</p>
          </div>
        </div>
      </section>

      <section id="tools" className="container py-16 md:py-24">
        <div className="mb-8 flex items-end justify-between border-b border-[#d8d4c9] pb-4">
          <div><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">02 / Start here</p><h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Popular tools</h2></div>
          <span className="hidden font-mono text-xs text-black/40 sm:block">{featuredTools.length.toString().padStart(2, "0")} utilities</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {featuredTools.map((tool, index) => { const Icon = tool.icon; return (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group relative min-h-64 overflow-hidden border border-[#d8d4c9] bg-[#fffdf8] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#171717] hover:shadow-[8px_8px_0_#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
              <div className="flex items-start justify-between"><span className="font-mono text-xs text-black/30">0{index + 1}</span><span className="flex size-10 items-center justify-center rounded-lg bg-[#edf7d5] text-[#171717]"><Icon size={20} /></span></div>
              <div className="absolute bottom-6 left-6 right-6"><h3 className="text-xl font-bold tracking-tight">{tool.name}</h3><p className="mt-2 text-sm leading-6 text-black/55">{tool.description}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">Open tool <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></div>
            </Link>
          ); })}
        </div>
      </section>

      <section className="border-y border-[#d8d4c9] bg-[#e8e4d9]">
        <div className="container py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[.7fr_1.3fr]">
            <div><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">03 / Browse</p><h2 className="mt-3 max-w-sm text-3xl font-black tracking-tight md:text-4xl">Pick a lane. Get it done.</h2></div>
            <div className="grid gap-px overflow-hidden border border-[#d8d4c9] bg-[#d8d4c9] sm:grid-cols-2">
              {categories.map((category) => { const Icon = category.icon; return (
                <Link key={category.slug} href={`/categories/${category.slug}`} className="group bg-[#f3f0e8] p-6 transition hover:bg-[#c8f169] focus:outline-none focus:ring-4 focus:ring-[#171717] focus:ring-inset">
                  <div className="flex items-center justify-between"><Icon size={20} /><ArrowRight size={16} className="opacity-30 transition group-hover:translate-x-1 group-hover:opacity-100" /></div>
                  <h3 className="mt-8 font-bold">{category.name}</h3><p className="mt-2 text-sm leading-6 text-black/50">{category.description}</p>
                </Link>
              ); })}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24"><div className="grid gap-8 md:grid-cols-3">
        {[["FAST", "Lightweight tools built to get you from question to answer quickly."], ["PRIVATE", "Browser-side processing whenever a task can safely stay on your device."], ["CLEAR", "Useful interfaces, plain language and controls that work on every screen."]].map(([title, text]) => <div key={title} className="border-t-2 border-[#171717] pt-4"><p className="font-mono text-xs font-bold tracking-[0.16em]">{title}</p><p className="mt-3 max-w-sm text-sm leading-6 text-black/55">{text}</p></div>)}
      </div></section>
      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-3 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><p className="text-white/40">© {new Date().getFullYear()} · Built for the little things.</p></div></footer>
    </main>
  );
}
