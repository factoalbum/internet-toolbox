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
    return {
      title: category.name,
      description: `${category.description} Browse free online tools from Internet Toolbox.`,
    };
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const categoryTools = tools.filter((tool) => tool.category === category.slug);
  const Icon = category.icon;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight text-slate-950">Internet Toolbox</Link>
          <Link href="/" className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-950">
            <ArrowLeft size={16} /> Home
          </Link>
        </div>
      </header>

      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700" aria-hidden="true"><Icon size={22} /></div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-600">Category</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">{category.name}</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">{category.description}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool) => {
              const ToolIcon = tool.icon;
              return (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-700"><ToolIcon size={21} /></span>
                    <ArrowRight size={18} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" />
                  </div>
                  <h2 className="mt-5 font-semibold text-slate-950">{tool.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{tool.description}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-blue-600">{tool.status === "live" ? "Use tool" : "Coming soon"}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
