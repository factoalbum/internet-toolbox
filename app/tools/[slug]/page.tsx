import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Wrench } from "lucide-react";
import JsonFormatter from "@/components/tools/json-formatter";
import PercentageCalculator from "@/components/tools/percentage-calculator";
import WordCounter from "@/components/tools/word-counter";
import { tools } from "@/lib/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const tool = tools.find((item) => item.slug === slug);
    if (!tool) return {};
    return { title: tool.name, description: `${tool.description} Free, fast and easy to use.` };
  });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) notFound();
  const Icon = tool.icon;

  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <header className="bg-[#171717] text-white">
        <div className="container flex h-[72px] items-center justify-between">
          <Link href="/" className="font-bold tracking-tight">Internet Toolbox</Link>
          <Link href="/tools" className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-bold uppercase tracking-[0.12em] text-white/55 transition hover:bg-white/10 hover:text-white"><ArrowLeft size={15} /> All tools</Link>
        </div>
      </header>

      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-start justify-between gap-8 border-b-2 border-[#171717] pb-8">
            <div><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Tool / {tool.category}</p><h1 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-6xl">{tool.name}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-black/55 md:text-lg">{tool.description}</p></div>
            <div className="hidden size-14 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] md:flex" aria-hidden="true"><Icon size={25} /></div>
          </div>

          <div className="mt-8">
            {slug === "percentage-calculator" && <PercentageCalculator />}
            {slug === "json-formatter" && <JsonFormatter />}
            {slug === "word-counter" && <WordCounter />}
            {!tool.status.includes("live") && (
              <div className="border border-[#d8d4c9] bg-[#fffdf8] p-6 md:p-8">
                <div className="flex min-h-64 flex-col items-center justify-center border border-dashed border-[#bcb8ae] bg-[#f3f0e8] px-6 text-center">
                  <Wrench className="text-black/35" size={28} aria-hidden="true" />
                  <h2 className="mt-4 font-bold">Coming soon</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-black/50">We are building this tool with the same fast, privacy-friendly experience. Check back soon.</p>
                </div>
              </div>
            )}
          </div>

          <article className="mt-10 grid gap-6 border-t border-[#d8d4c9] pt-8 md:grid-cols-[.35fr_.65fr]">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-black/40">About this tool</h2>
            <p className="text-sm leading-7 text-black/55">Internet Toolbox provides simple online utilities designed to answer common questions quickly. Our tools work in your browser where practical, require no account, and are built with clear instructions and accessible controls.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
