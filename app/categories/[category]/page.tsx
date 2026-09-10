import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import SiteHeader from "@/components/site-header";
import { categories, tools, type ToolCategory } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) return { title: "Category | Internet Toolbox" };
  return {
    title: `${category.name} | Internet Toolbox`,
    description: `${category.description} Browse simple free tools from Internet Toolbox.`,
    alternates: { canonical: `${siteUrl}/categories/${slug}` },
    openGraph: { title: `${category.name} | Internet Toolbox`, description: `${category.description} Browse simple free tools from Internet Toolbox.`, url: `${siteUrl}/categories/${slug}`, type: "website" },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const categoryTools = tools.filter((tool) => tool.category === (slug as ToolCategory) && tool.status === "live");
  const Icon = category.icon;
  const listJsonLd = { "@context": "https://schema.org", "@type": "ItemList", name: `${category.name} - Internet Toolbox`, numberOfItems: categoryTools.length, itemListElement: categoryTools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: `${siteUrl}/tools/${tool.slug}/` })) };

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
      <SiteHeader />
      <section className="border-b border-[#dedbd3] bg-white">
        <div className="container py-8 md:py-11">
          <nav aria-label="Breadcrumb" className="text-xs text-black/40">
            <Link href="/" className="hover:text-black hover:underline">Home</Link><span className="mx-2">/</span><Link href="/tools" className="hover:text-black hover:underline">All tools</Link><span className="mx-2">/</span><span className="font-semibold text-black/70">{category.name}</span>
          </nav>
          <div className="mt-7 flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#c8f169]"><Icon size={21} aria-hidden="true" /></span>
            <div className="min-w-0 max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#66812b]">Tool collection</p>
              <h1 className="mt-1 break-words text-3xl font-black tracking-[-0.04em] md:text-5xl">{category.name}</h1>
              <p className="mt-3 text-sm leading-6 text-black/50 md:text-base">{category.description} Pick a tool below and get straight to the task.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-12" aria-labelledby="category-tools-heading">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/35">Available now</p><h2 id="category-tools-heading" className="mt-1 text-xl font-black md:text-2xl">Choose a tool</h2></div>
          <span className="hidden text-xs font-semibold text-black/35 sm:block">{categoryTools.length} tools</span>
        </div>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => {
            const ToolIcon = tool.icon;
            return <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group min-w-0 rounded-xl border border-[#dedbd3] bg-white p-4 transition hover:border-[#171717] hover:shadow-[0_8px_24px_rgba(23,23,23,.07)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]">
              <div className="flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f0f4e8]"><ToolIcon size={17} aria-hidden="true" /></span><div className="min-w-0"><h3 className="truncate text-sm font-extrabold">{tool.name}</h3><p className="mt-0.5 truncate text-[11px] text-black/40">{tool.description}</p></div></div>
              <div className="mt-4 flex items-center justify-between border-t border-[#eeeae3] pt-3"><span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#66812b]"><Check size={12} aria-hidden="true" /> Free</span><span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-black/35 transition group-hover:text-black">Open <ArrowRight size={12} /></span></div>
            </Link>;
          })}
        </div>
        <div className="mt-8 rounded-xl border border-[#dedbd3] bg-white p-4 text-sm text-black/45 md:p-5"><p className="font-semibold text-black/70">Simple by design.</p><p className="mt-1">Open a tool, do the task, and get your result. No account required for browser-based tools.</p></div>
      </section>
      <footer className="border-t border-[#dedbd3] bg-white"><div className="container flex flex-col gap-4 py-7 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-black/45"><Link href="/about" className="hover:text-black">About</Link><Link href="/privacy" className="hover:text-black">Privacy</Link><Link href="/terms" className="hover:text-black">Terms</Link><Link href="/faq" className="hover:text-black">FAQ</Link><Link href="/support" className="hover:text-black">Support</Link></div></div></footer>
    </main>
  );
}
