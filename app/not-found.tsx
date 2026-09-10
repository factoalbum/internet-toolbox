import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import SiteHeader from "@/components/site-header";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <SiteHeader />
      <section className="container flex min-h-[70vh] items-center py-16">
        <div className="mx-auto w-full max-w-2xl text-center">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-black/35">404 / Not found</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] md:text-7xl">That tool is not here.</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-black/55">The page may have moved or the link may be outdated. Start from the toolbox and find what you need.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/tools" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#171717] px-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><Search size={16} aria-hidden="true" /> Browse all tools</Link>
            <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#bcb8ae] bg-[#fffdf8] px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><ArrowLeft size={16} aria-hidden="true" /> Go home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
