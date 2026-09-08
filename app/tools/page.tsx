import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { categories, tools } from "@/lib/tools";

export const metadata = {
  title: "All Tools",
  description: "Browse every calculator, developer utility, text tool and file tool in Internet Toolbox.",
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <header className="bg-[#171717] text-white">
        <div className="container flex h-[72px] items-center justify-between">
          <Link href="/" className="font-bold tracking-tight">Internet Toolbox</Link>
          <Link href="/" className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-white/60 transition hover:bg-white/10 hover:text-white">
            <ArrowLeft size={16} /> Home
          </Link>
        </div>
      </header>

      <section className="border-b border-[#d8d4c9] bg-[#171717] py-14 text-white md:py-20">
        <div className="container">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#c8f169]">01 / Tool library</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-[-0.045em] md:text-7xl">Every tool.<br />One place.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/55 md:text-lg">Browse the complete Internet Toolbox library. Live tools are ready to use; more utilities are being added continuously.</p>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="space-y-14">
          {categories.map((category, categoryIndex) => {
            const Icon = category.icon;
            const categoryTools = tools.filter((tool) => tool.category === category.slug);
            return (
              <section key={category.slug}>
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#d8d4c9] pb-4">
                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-black/35">0{categoryIndex + 2} / Category</p>
                    <div className="mt-2 flex items-center gap-3"><Icon size={20} /><h2 className="text-2xl font-black tracking-tight md:text-3xl">{category.name}</h2></div>
                  </div>
                  <span className="font-mono text-xs text-black/35">{categoryTools.length.toString().padStart(2, "0")}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryTools.map((tool) => {
                    const ToolIcon = tool.icon;
                    const live = tool.status === "live";
                    return (
                      <Link key={tool.slug} href={`/tools/${tool.slug}`} className={`group border p-5 transition duration-200 ${live ? "border-[#171717] bg-[#fffdf8] hover:-translate-y-1 hover:shadow-[7px_7px_0_#c8f169]" : "border-[#d8d4c9] bg-[#ebe7dc] hover:border-black/30"}`}>
                        <div className="flex items-start justify-between gap-4">
                          <span className="flex size-10 items-center justify-center rounded-lg bg-[#edf7d5]"><ToolIcon size={19} /></span>
                          <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${live ? "text-[#5b8b17]" : "text-black/30"}`}>{live ? "Live" : "Soon"}</span>
                        </div>
                        <h3 className="mt-6 font-bold">{tool.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-black/50">{tool.description}</p>
                        <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">{live ? "Open tool" : "Preview"} <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-3 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><p className="text-white/40">© {new Date().getFullYear()} · Built for the little things.</p></div></footer>
    </main>
  );
}
