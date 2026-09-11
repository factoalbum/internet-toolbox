import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import SiteHeader from "@/components/site-header";
import ToolIcon from "@/components/tool-icon";
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
  return { title: `${category.name} | Internet Toolbox`, description: `${category.description} Browse simple free tools from Internet Toolbox.`, alternates: { canonical: `${siteUrl}/categories/${slug}` }, openGraph: { title: `${category.name} | Internet Toolbox`, description: `${category.description} Browse simple free tools from Internet Toolbox.`, url: `${siteUrl}/categories/${slug}`, type: "website" } };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const categoryTools = tools.filter((tool) => tool.category === (slug as ToolCategory) && tool.status === "live");
  const Icon = category.icon;
  const listJsonLd = { "@context": "https://schema.org", "@type": "ItemList", name: `${category.name} - Internet Toolbox`, numberOfItems: categoryTools.length, itemListElement: categoryTools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: `${siteUrl}/tools/${tool.slug}/` })) };

  return <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
    <SiteHeader />
    <section className="bg-white">
      <div className="container py-7 md:py-12">
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-black/40"><Link href="/" className="hover:text-black">Home</Link><span className="mx-2">/</span><Link href="/tools" className="hover:text-black">All tools</Link><span className="mx-2">/</span><span className="text-black/70">{category.name}</span></nav>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl"><ToolIcon icon={Icon} slug={category.slug} category={category.slug} size={25} /><p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#6d8e25]">Tool collection</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em] md:text-6xl">{category.name}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-black/55 md:text-lg">{category.description} Pick a tool and get straight to the task — no account, no complicated setup.</p></div>
          <div className="rounded-2xl border border-[#e1ded6] bg-[#faf9f6] px-5 py-4 lg:min-w-44"><p className="text-2xl font-black">{categoryTools.length}</p><p className="mt-1 text-xs font-semibold text-black/45">free tools available</p></div>
        </div>
      </div>
    </section>
    <section className="container py-10 md:py-14" aria-labelledby="category-tools-heading">
      <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d8e25]">Available now</p><h2 id="category-tools-heading" className="mt-1 text-2xl font-black md:text-3xl">Choose a tool</h2></div><Link href="/tools" className="inline-flex items-center gap-2 text-sm font-bold">All tools <ArrowRight size={15} /></Link></div>
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">{categoryTools.map((tool) => { return <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex min-w-0 flex-col rounded-2xl border border-[#e0ddd5] bg-white p-3.5 aspect-square sm:aspect-auto sm:min-h-44 sm:p-5 transition hover:-translate-y-1 hover:border-[#171717] hover:shadow-[0_14px_32px_rgba(23,23,23,.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]"><div className="flex items-start justify-between gap-2"><ToolIcon icon={tool.icon} slug={tool.slug} category={tool.category} size={17} className="size-9 sm:size-11" /><ArrowRight size={15} className="mt-0.5 shrink-0 text-black/20 transition group-hover:translate-x-1 group-hover:text-black sm:mt-1 sm:size-[17px]" aria-hidden="true" /></div><h3 className="mt-auto pt-3 text-xs font-extrabold leading-4 sm:pt-7 sm:text-sm sm:leading-5">{tool.name}</h3><p className="mt-1 line-clamp-2 text-[10px] leading-4 text-black/45 sm:mt-1.5 sm:text-xs sm:leading-5">{tool.description}</p><span className="mt-2 inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.1em] text-[#66812b] sm:mt-4 sm:gap-1.5 sm:text-[10px] sm:tracking-[0.12em]"><Check size={10} className="sm:hidden" aria-hidden="true" /><Check size={12} className="hidden sm:block" aria-hidden="true" /> Free to use</span></Link>; })}</div>
    </section>
    <section className="border-y border-[#e4e1d9] bg-[#f2f0ea]"><div className="container py-10 md:py-14"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d8e25]">Simple by design</p><h2 className="mt-2 text-2xl font-black md:text-3xl">Open. Do the thing. Done.</h2><p className="mt-3 text-sm leading-6 text-black/50">Every tool is designed to get you from question to result with as little friction as possible.</p></div></div></section>
    <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-5 py-9 text-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">Internet Toolbox</p><p className="mt-1 text-xs text-white/35">Small tools. Less hassle.</p></div><div className="flex flex-wrap gap-x-5 gap-y-2 text-white/50"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link></div></div></footer>
  </main>;
}
