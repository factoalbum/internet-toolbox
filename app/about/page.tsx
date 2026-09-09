import Link from "next/link";
import SiteHeader from "@/components/site-header";

export const metadata = {
  title: "About",
  description: "Learn why Internet Toolbox exists and how the tools are designed.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <SiteHeader />

      <section className="border-b border-[#d8d4c9] bg-[#e8e4d9] py-14 md:py-20">
        <div className="container">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">About Internet Toolbox</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-[-0.045em] md:text-7xl">Useful tools.<br /><span className="text-[#5f7429]">Less friction.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Internet Toolbox is a collection of small online utilities for everyday tasks. Each one is meant to be useful without feeling like a full app.</p>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[.35fr_.65fr]">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-black/40">Our approach</p>
          <div className="space-y-10 text-base leading-8 text-black/60">
            <div><h2 className="text-2xl font-black text-[#171717]">Make common tasks obvious</h2><p className="mt-3">Each tool focuses on one job. Useful defaults, plain labels and visible results come first.</p></div>
            <div><h2 className="text-2xl font-black text-[#171717]">Privacy by design</h2><p className="mt-3">When a task can run safely in your browser, it stays there. You do not need an account for a simple utility.</p></div>
            <div><h2 className="text-2xl font-black text-[#171717]">Build what people need</h2><p className="mt-3">The library grows around practical use cases. New tools should solve a real problem and stay easy to use on phones and larger screens.</p></div>
          </div>
        </div>
      </section>

      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
    </main>
  );
}
