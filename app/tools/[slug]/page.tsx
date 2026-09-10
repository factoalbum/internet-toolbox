import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import SiteHeader from "@/components/site-header";
import ToolRouter from "@/components/tools/tool-router";
import { categories, tools } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export function generateStaticParams() { return tools.map((tool) => ({ slug: tool.slug })); }

function getCategory(slug: string) { return categories.find((category) => category.slug === slug); }
function getSeo(tool: (typeof tools)[number]) {
  const title = `${tool.name} - Free Online Tool`;
  return { title, description: `${tool.description} Use it free in your browser.`, intro: tool.description, uses: [`Use ${tool.name.toLowerCase()} without signing up`, "Enter your information and run the main action", "Get a clear result you can use or download"] };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) return {};
  const seo = getSeo(tool); const toolUrl = `${siteUrl}/tools/${tool.slug}`;
  return { title: seo.title, description: seo.description, alternates: { canonical: toolUrl }, openGraph: { type: "website", title: `${seo.title} | Internet Toolbox`, description: seo.description, url: toolUrl }, twitter: { card: "summary", title: `${seo.title} | Internet Toolbox`, description: seo.description } };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) notFound();
  const category = getCategory(tool.category);
  if (!category) notFound();
  const Icon = tool.icon;
  const seo = getSeo(tool);
  const relatedTools = tools.filter((item) => item.category === tool.category && item.slug !== tool.slug && item.status === "live").slice(0, 3);
  const toolUrl = `${siteUrl}/tools/${tool.slug}/`;
  const categoryUrl = `${siteUrl}/categories/${category.slug}/`;
  const structuredData = [{ "@context": "https://schema.org", "@type": "WebApplication", name: tool.name, description: seo.description, url: toolUrl, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` }, { "@type": "ListItem", position: 2, name: category.name, item: categoryUrl }, { "@type": "ListItem", position: 3, name: tool.name, item: toolUrl }] }];

  return <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <SiteHeader />
    <section className="container py-7 md:py-10 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-semibold text-black/45">
          <Link href="/tools" className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-[#d8d4c9] bg-[#fffdf8] px-3 transition hover:border-[#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><ArrowLeft size={13} />All tools</Link><span aria-hidden="true">/</span><Link href={`/categories/${category.slug}`} className="shrink-0 hover:text-black">{category.name}</Link><span aria-hidden="true">/</span><span className="truncate text-black">{tool.name}</span>
        </nav>
        <header className="grid gap-7 lg:grid-cols-[1fr_280px] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3"><div className="flex size-14 items-center justify-center rounded-[18px] border border-[#cfd8b7] bg-[#e8f4c9] text-[#435816] shadow-[4px_4px_0_#171717]" aria-hidden="true"><Icon size={25} /></div><div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6d8e25]">{category.name}</p><p className="mt-1 text-xs font-semibold text-black/40">A simple tool for getting one thing done.</p></div></div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl md:text-6xl">{tool.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-black/55 md:text-lg">{seo.intro}</p>
          </div>
          <aside className="rounded-[22px] border border-[#d8d4c9] bg-[#fffdf8] p-5 shadow-[5px_5px_0_#d8d4c9]"><p className="text-[11px] font-black uppercase tracking-[0.16em] text-black/35">Before you start</p><div className="mt-4 space-y-3">{["No sign-up required", "Simple, focused workspace", "Free to use"].map((item) => <p key={item} className="flex items-center gap-2.5 text-sm font-bold"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#c8f169]"><Check size={13} strokeWidth={3} /></span>{item}</p>)}</div></aside>
        </header>
        <section data-tool-workspace className="mt-9 overflow-hidden rounded-[24px] border border-[#d1cdc2] bg-[#fffdf8] shadow-[0_14px_36px_rgba(23,23,23,0.07)] md:mt-11" aria-labelledby="workspace-title">
          <div className="flex items-center justify-between gap-4 border-b border-[#e1ded5] bg-[#f8f5ed] px-4 py-3.5 md:px-5"><div className="min-w-0"><p id="workspace-title" className="text-sm font-black">Use the tool</p><p className="hidden text-xs text-black/40 sm:block">Your work stays on this page.</p></div><span className="shrink-0 rounded-full border border-[#d8d4c9] bg-white px-3 py-1.5 text-[11px] font-bold text-black/45">Free tool</span></div>
          <div className="min-w-0 overflow-hidden"><ToolRouter slug={slug} /></div>
        </section>
        <section className="mt-12 grid gap-8 border-t border-[#d8d4c9] pt-9 md:grid-cols-[0.75fr_1.25fr] md:gap-12" aria-labelledby="tool-guide"><div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6d8e25]">Quick guide</p><h2 id="tool-guide" className="mt-2 text-3xl font-black tracking-[-0.04em]">How it works</h2><p className="mt-3 text-sm leading-6 text-black/45">No complicated setup. Use the main action and take your result.</p></div><ul className="grid gap-3">{seo.uses.map((use, index) => <li key={use} className="flex gap-4 rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] p-4"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-black text-white">{index + 1}</span><span className="pt-1 text-sm font-semibold leading-6">{use}</span></li>)}</ul></section>
        {relatedTools.length > 0 && <section className="mt-12 border-t border-[#d8d4c9] pt-9" aria-labelledby="related-tools"><div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6d8e25]">Keep going</p><h2 id="related-tools" className="mt-2 text-3xl font-black tracking-[-0.04em]">You might also need</h2></div><Link href="/tools" className="hidden items-center gap-2 rounded-full border border-[#d8d4c9] bg-[#fffdf8] px-4 py-2 text-xs font-black sm:inline-flex">All tools <ArrowRight size={13} /></Link></div><div className="mt-5 grid gap-4 sm:grid-cols-3">{relatedTools.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="group rounded-[22px] border border-[#d8d4c9] bg-[#fffdf8] p-5 transition hover:-translate-y-1 hover:border-[#171717] hover:shadow-[5px_5px_0_#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><span className="flex size-10 items-center justify-center rounded-xl bg-[#e8f4c9] text-[#435816]"><item.icon size={18} /></span><h3 className="mt-5 text-sm font-black">{item.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-black/45">{item.description}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[#6d8e25]">Open tool <ArrowRight size={12} /></span></Link>)}</div></section>}
      </div>
    </section>
    <footer className="mt-4 border-t-2 border-[#171717] bg-[#171717] text-white"><div className="container flex flex-col gap-5 py-9 text-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black">Internet Toolbox</p><p className="mt-1 text-xs text-white/45">Small tools. Less friction.</p></div><div className="flex flex-wrap gap-x-5 gap-y-2 text-white/55"><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/faq">FAQ</Link><Link href="/support">Support</Link><Link href="/tools" className="font-bold text-white">All tools</Link></div></div></footer>
  </main>;
}
