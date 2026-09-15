import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import SiteHeader from "@/components/site-header";

const popularTools = [
  ["Percentage Calculator", "/tools/percentage-calculator"],
  ["EMI Calculator", "/tools/emi-calculator"],
  ["Age Calculator", "/tools/age-calculator"],
  ["Unit Converter", "/tools/unit-converter"],
  ["JSON Formatter", "/tools/json-formatter"],
  ["Word Counter", "/tools/word-counter"],
] as const;

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <SiteHeader />
      <section className="container py-16 sm:py-20">
        <div className="mx-auto w-full max-w-2xl text-center">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-black/35">404 / Not found</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] md:text-7xl">That tool is not here.</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-black/55">The page may have moved or the link may be outdated. Start from the toolbox and find what you need.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/tools" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#171717] px-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><Search size={16} aria-hidden="true" /> Browse all tools</Link>
            <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#bcb8ae] bg-[#fffdf8] px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><ArrowLeft size={16} aria-hidden="true" /> Go home</Link>
          </div>
        </div>

        <section className="mx-auto mt-14 max-w-3xl border-t border-[#d8d4c9] pt-8" aria-labelledby="popular-tools-heading">
          <div className="flex items-end justify-between gap-4">
            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-[.16em] text-[#6d8e25]">Popular tools</p>
              <h2 id="popular-tools-heading" className="mt-2 text-xl font-black tracking-[-.02em]">Try one of these instead</h2>
            </div>
            <Link href="/tools" className="hidden min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-black sm:inline-flex focus:outline-none focus:ring-4 focus:ring-[#c8f169]">All tools <ArrowRight size={13} aria-hidden="true" /></Link>
          </div>
          <nav aria-label="Popular tools" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {popularTools.map(([name, href]) => (
              <Link key={href} href={href} className="group flex min-h-16 items-center justify-between gap-2 rounded-xl border border-[#dedbd3] bg-white px-4 py-3 text-left text-sm font-bold transition hover:border-[#171717] hover:shadow-[0_7px_18px_rgba(23,23,23,.06)] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
                <span>{name}</span>
                <ArrowRight size={14} className="shrink-0 text-black/25 transition group-hover:translate-x-0.5 group-hover:text-black" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </section>
      </section>
    </main>
  );
}
