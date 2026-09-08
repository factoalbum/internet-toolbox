import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "About",
  description: "Learn why Internet Toolbox exists and how the tools are designed.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <header className="border-b border-[#d8d4c9] bg-[#f3f0e8]">
        <div className="container flex h-[68px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Internet Toolbox home">
            <span className="flex size-8 items-center justify-center border border-[#171717] bg-[#171717] text-xs font-bold text-white" aria-hidden="true">IT</span>
            <span className="text-[15px] font-semibold">Internet Toolbox</span>
          </Link>
          <Link href="/tools" className="flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-black/60 hover:bg-black/5"><ArrowLeft size={15} /> All tools</Link>
        </div>
      </header>

      <section className="border-b border-[#d8d4c9] bg-[#e8e4d9] py-14 md:py-20">
        <div className="container">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">About Internet Toolbox</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-[-0.045em] md:text-7xl">Useful tools.<br /><span className="text-[#5f7429]">Less friction.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Internet Toolbox is a growing collection of small online utilities made for the everyday tasks that should take seconds, not a complicated app.</p>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[.35fr_.65fr]">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-black/40">Our approach</p>
          <div className="space-y-10 text-base leading-8 text-black/60">
            <div><h2 className="text-2xl font-black text-[#171717]">Make common tasks obvious</h2><p className="mt-3">Each tool is designed around one clear job. We prefer useful defaults, plain language and visible results over unnecessary settings.</p></div>
            <div><h2 className="text-2xl font-black text-[#171717]">Privacy by design</h2><p className="mt-3">When a task can safely run in your browser, we keep it there. This reduces friction and means you do not need an account just to use a simple utility.</p></div>
            <div><h2 className="text-2xl font-black text-[#171717]">Built gradually</h2><p className="mt-3">The library will grow based on practical use cases. New tools should solve a real problem, work reliably and remain easy to understand on both desktop and mobile.</p></div>
          </div>
        </div>
      </section>

      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
    </main>
  );
}
