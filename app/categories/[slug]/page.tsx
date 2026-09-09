import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/site-header";
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
    <main className="min-h-screen overflow-x-clip bg-[#f3f0e8] text-[#171717]">
      <SiteHeader />
      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-w-0 items-start justify-between gap-6 border-b-2 border-[#171717] pb-8">
            <div className="min-w-0"><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Category / Tool index</p><h1 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-6xl">{category.name}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-black/55 md:text-lg">{category.description}</p></div>
            <div className="hidden size-14 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] md:flex" aria-hidden="true"><Icon size={25} /></div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {categoryTools.map((tool, index) => {
              const ToolIcon = tool.icon;
              return <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex min-h-52 min-w-0 flex-col border border-[#d8d4c9] bg-[#fffdf8] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#171717] hover:shadow-[7px_7px_0_#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><div className="flex items-start justify-between gap-3"><span className="font-mono text-xs text-black/30">{String(index + 1).padStart(2, "0")}</span><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#edf7d5]"><ToolIcon size={20} /></span></div><div className="mt-auto min-w-0"><h2 className="break-words text-xl font-bold tracking-tight">{tool.name}</h2><p className="mt-2 break-words text-sm leading-6 text-black/50">{tool.description}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">{tool.status === "live" ? "Use tool" : "Coming soon"}<ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></div></Link>;
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
