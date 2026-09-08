import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Wrench } from "lucide-react";
import PercentageCalculator from "@/components/tools/percentage-calculator";
import { tools } from "@/lib/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const tool = tools.find((item) => item.slug === slug);
    if (!tool) return {};
    return {
      title: tool.name,
      description: `${tool.description} Free, fast and easy to use.`,
    };
  });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) notFound();
  const Icon = tool.icon;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight text-slate-950">Internet Toolbox</Link>
          <Link href="/" className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-950">
            <ArrowLeft size={16} /> All tools
          </Link>
        </div>
      </header>

      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700" aria-hidden="true"><Icon size={22} /></div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-600">{tool.category}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">{tool.name}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{tool.description}</p>

          <div className="mt-8">
            {slug === "percentage-calculator" ? <PercentageCalculator /> : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
                  <Wrench className="text-slate-400" size={28} aria-hidden="true" />
                  <h2 className="mt-4 font-semibold text-slate-900">Coming soon</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">We are building this tool with the same fast, privacy-friendly experience. Check back soon.</p>
                </div>
              </div>
            )}
          </div>

          <article className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-950">About {tool.name}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Internet Toolbox provides simple online utilities designed to answer common questions quickly. Our tools work in your browser where practical, require no account, and are built with clear instructions and accessible controls.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
