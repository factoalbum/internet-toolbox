import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Info, LockKeyhole } from "lucide-react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ToolRouter from "@/components/tools/tool-router";
import { categories, tools } from "@/lib/tools";
import { getToolContent } from "@/lib/tool-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";
export function generateStaticParams() { return tools.filter((tool) => tool.status === "live").map((tool) => ({ slug: tool.slug })); }
function getCategory(slug: string) { return categories.find((category) => category.slug === slug); }
function getWorkspaceHint(category: string) {
  if (category === "calculators") return "Enter the values you want to calculate, then review the estimate below.";
  if (category === "file-image-tools") return "Choose your file or image, set any options, then create your result.";
  if (category === "developer-tools") return "Paste or enter the data you want to process, then run the tool.";
  if (category === "text-tools") return "Enter the text you want to work with, then review and copy the result.";
  return "Enter the details the tool needs, then review the result before using it.";
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool || tool.status !== "live") return {};
  const title = `${tool.name} - Free Online Tool`;
  const description = `${tool.description} Learn how it works, what it is useful for and its limitations.`;
  const toolUrl = `${siteUrl}/tools/${tool.slug}/`;
  return { title, description, alternates: { canonical: toolUrl }, openGraph: { type: "website", title: `${title} | Internet Toolbox`, description, url: toolUrl }, twitter: { card: "summary", title: `${title} | Internet Toolbox`, description } };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool || tool.status !== "live") notFound();
  const category = getCategory(tool.category);
  if (!category) notFound();
  const Icon = tool.icon;
  const content = getToolContent(tool.slug, tool);
  const relatedTools = tools.filter((item) => item.category === tool.category && item.slug !== tool.slug && item.status === "live").slice(0, 3);
  const toolUrl = `${siteUrl}/tools/${tool.slug}/`;
  const categoryUrl = `${siteUrl}/categories/${category.slug}/`;
  const workspaceHint = getWorkspaceHint(tool.category);
  const advisory = tool.category === "calculators"
    ? "Calculator results are estimates. Check important financial, tax or market figures against the relevant current official source or professional advice."
    : tool.slug === "bmi-calculator"
      ? "Health note: BMI is a screening measure, not a diagnosis or a substitute for medical advice."
      : tool.slug === "direct-video-downloader"
        ? "Use this only for direct media files you own or are authorized to download. It does not bypass DRM, access controls or platform restrictions."
        : "Review the result before using it in an important workflow, especially when the source data or output will be shared publicly.";
  const structuredData = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: tool.name, description: tool.description, url: toolUrl, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` }, { "@type": "ListItem", position: 2, name: category.name, item: categoryUrl }, { "@type": "ListItem", position: 3, name: tool.name, item: toolUrl }] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: content.faq[0], acceptedAnswer: { "@type": "Answer", text: content.faq[1] } }] },
  ];
  return <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <SiteHeader />
    <section className="container py-6 md:py-9 lg:py-11"><div className="mx-auto max-w-5xl">
      <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-semibold text-black/45"><Link href="/tools" className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-[#dedbd3] bg-white px-3.5 transition hover:border-[#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><ArrowLeft size={13} />All tools</Link><span aria-hidden="true">/</span><Link href={`/categories/${category.slug}`} className="shrink-0 hover:text-black">{category.name}</Link><span aria-hidden="true">/</span><span className="truncate text-black">{tool.name}</span></nav>
      <header className="max-w-3xl"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#e8f4c9] text-[#435816]" aria-hidden="true"><Icon size={22} /></span><div><p className="text-[11px] font-black uppercase tracking-[.15em] text-[#6d8e25]">{category.name}</p><p className="mt-0.5 text-xs font-medium text-black/40">Free browser tool</p></div></div><h1 className="mt-5 text-4xl font-black leading-[1] tracking-[-.055em] sm:text-5xl md:text-6xl">{tool.name}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-black/55 md:text-lg">{content.overview}</p></header>
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#dfe7c8] bg-[#f3f8e7] p-4 text-sm leading-6 text-[#4d5e25]"><Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><p>{advisory}</p></div>
      <section data-tool-workspace className="mt-8 overflow-hidden rounded-3xl border border-[#dedbd3] bg-white shadow-[0_10px_30px_rgba(23,23,23,.045)] md:mt-10" aria-labelledby="workspace-title"><div className="flex flex-col gap-3 border-b border-[#e8e5dd] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"><div className="min-w-0"><h2 id="workspace-title" className="text-sm font-black">Use {tool.name}</h2><p className="mt-0.5 text-xs leading-5 text-black/40">{workspaceHint}</p></div><span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#f2f6e8] px-3 py-1.5 text-[11px] font-bold text-[#52691f]"><LockKeyhole size={12} /> Runs in your browser</span></div><div className="min-w-0 overflow-hidden"><ToolRouter slug={slug} /></div></section>
      <article className="mt-10 grid gap-6 md:grid-cols-3" aria-label="Tool guide">
        <section className="rounded-2xl border border-[#e0ddd5] bg-white p-5"><p className="text-[10px] font-black uppercase tracking-[.15em] text-[#6d8e25]">Best for</p><p className="mt-3 text-sm leading-6 text-black/60">{content.bestFor}</p></section>
        <section className="rounded-2xl border border-[#e0ddd5] bg-white p-5"><p className="text-[10px] font-black uppercase tracking-[.15em] text-[#6d8e25]">Helpful tip</p><p className="mt-3 text-sm leading-6 text-black/60">{content.tip}</p></section>
        <section className="rounded-2xl border border-[#e0ddd5] bg-white p-5"><p className="text-[10px] font-black uppercase tracking-[.15em] text-[#6d8e25]">Limitation</p><p className="mt-3 text-sm leading-6 text-black/60">{content.limitation}</p></section>
      </article>
      <section className="mt-10 border-t border-[#dedbd3] pt-8" aria-labelledby="tool-guide"><div className="grid gap-6 md:grid-cols-[.7fr_1.3fr] md:gap-12"><div><p className="text-[11px] font-black uppercase tracking-[.15em] text-[#6d8e25]">How to use it</p><h2 id="tool-guide" className="mt-2 text-2xl font-black tracking-[-.04em]">A simple workflow</h2><p className="mt-2 text-sm leading-6 text-black/45">Use the controls above, check the result, then copy or download it when available.</p></div><ol className="grid gap-2.5 sm:grid-cols-3 md:grid-cols-1"><li className="flex items-center gap-3 rounded-2xl border border-[#e3e0d8] bg-white p-4"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-black text-white">1</span><span className="text-sm font-semibold leading-5">Enter or select the information the tool asks for.</span></li><li className="flex items-center gap-3 rounded-2xl border border-[#e3e0d8] bg-white p-4"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-black text-white">2</span><span className="text-sm font-semibold leading-5">Run the calculation, conversion or comparison and inspect the result.</span></li><li className="flex items-center gap-3 rounded-2xl border border-[#e3e0d8] bg-white p-4"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-black text-white">3</span><span className="text-sm font-semibold leading-5">Copy, download or use the result only after checking it suits your task.</span></li></ol></div></section>
      <section className="mt-10 rounded-2xl border border-[#e0ddd5] bg-[#f2f0ea] p-6" aria-labelledby="faq-heading"><p className="text-[11px] font-black uppercase tracking-[.15em] text-[#6d8e25]">FAQ</p><h2 id="faq-heading" className="mt-2 text-2xl font-black">{content.faq[0]}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-black/60">{content.faq[1]}</p></section>
      {relatedTools.length > 0 && <section className="mt-10 border-t border-[#dedbd3] pt-8" aria-labelledby="related-tools"><div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[.15em] text-[#6d8e25]">Related</p><h2 id="related-tools" className="mt-2 text-2xl font-black tracking-[-.04em]">You might also need</h2></div><Link href="/tools" className="hidden items-center gap-2 text-xs font-black sm:inline-flex">All tools <ArrowRight size={13} /></Link></div><div className="mt-4 grid gap-3 sm:grid-cols-3">{relatedTools.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="group min-h-40 rounded-2xl border border-[#e0ddd5] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#171717] hover:shadow-[0_8px_20px_rgba(23,23,23,.06)] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><span className="flex size-9 items-center justify-center rounded-xl bg-[#e8f4c9] text-[#435816]"><item.icon size={17} /></span><h3 className="mt-4 text-sm font-black">{item.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-black/45">{item.description}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#6d8e25]">Open tool <ArrowRight size={12} /></span></Link>)}</div></section>}
    </div></section>
    <SiteFooter />
  </main>;
}
