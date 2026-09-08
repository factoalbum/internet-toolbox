import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { categories, tools } from "@/lib/tools";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const category = categories.find((item) => item.slug === slug);
    if (!category) return {};
    return { title: category.name, description: `${category.description} Browse free online tools from Internet Toolbox.` };
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const categoryTools = tools.filter((tool) => tool.category === category.slug);
  const Icon = category.icon;

  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <header className="border-b border-[#d8d4c9] bg-[#f3f0e8]">
        <div className="container flex h-[68px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Internet Toolbox home">
            <span className="flex size-8 items-center justify-center border border-[#171717] bg-[#171717] text-xs font-bold text-white" aria-hidden="true">IT</span>
            <span className="text-[15px] font-semibold tracking-[-0.01em]">Internet Toolbox</span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <Link href="/tools" className="flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-black/60 transition hover:bg-black/5 hover:text-[#171717]"><ArrowLeft size={15} /> All tools</Link>
          </nav>
        </div>
      </header>

      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-start justify-between gap-8 border-b-2 border-[#171717] pb-8">
            <div><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Category / Tool index</p><h1 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-6xl">{category.name}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-black/55 md:text-lg">{category.description}</p></div>
            <div className="hidden size-14 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] md:flex" aria-hidden="true"><Icon size={25} /></div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {categoryTools.map((tool, index) => {
              const ToolIcon = tool.icon;
              return (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex min-h-52 flex-col border border-[#d8d4c9] bg-[#fffdf8] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#171717] hover:shadow-[7px_7px_0_#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
                  <div className="flex items-start justify-between"><span className="font-mono text-xs text-black/30">{String(index + 1).padStart(2, "0")}</span><span className="flex size-10 items-center justify-center rounded-lg bg-[#edf7d5]"><ToolIcon size={20} /></span></div>
                  <div className="mt-auto"><h2 className="text-xl font-bold tracking-tight">{tool.name}</h2><p className="mt-2 text-sm leading-6 text-black/50">{tool.description}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">{tool.status === "live" ? "Use tool" : "Coming soon"} <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
