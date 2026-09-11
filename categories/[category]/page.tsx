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
  return { title: `${category.name} | Internet Toolbox`, description: `${category.description} Browse simple free tools from Internet Toolbox.`, alternates: { canonical: `${siteUrl}/categories/${slug}` }, openGraph: { title: `${category.name} | Internet Toolbox`, description: `${category.description} Browse simple free tools from Internet Toolbox.`, url: `${siteUrl}/categories/${slug}`, type: "website" } };
}

function getCategoryGuide(slug: ToolCategory) {
  const guides: Record<ToolCategory, { intro: string; choosing: string }> = {
    calculators: {
      intro: "Use these calculators for quick estimates involving everyday money, tax, loans, savings and returns. Enter the figures you know, review the assumptions shown by the tool, and use the result as a planning reference rather than a guaranteed quote.",
      choosing: "For financial or tax questions, start with the calculator that matches the specific calculation you need. Before making a decision, confirm rates, rules, fees and other details with the relevant current official source or provider.",
    },
    everyday: {
      intro: "These everyday tools handle practical calculations and conversions that come up at home, at work and while travelling. They are designed for quick answers without requiring an account or installing software.",
      choosing: "Pick the tool based on what you are measuring or planning: use duration tools for elapsed time, date tools for calendar calculations, unit tools for measurements, and the time-zone tool when a clock time needs to be compared across locations.",
    },
    developer: {
      intro: "Developer tools help with common data, encoding, identifier, security and debugging tasks directly in the browser. They are intended for quick inspection and transformation rather than replacing a full development environment.",
      choosing: "Choose a tool according to the format you are working with, then inspect the output before using it in code or production data. Avoid pasting secrets, tokens or other sensitive information unless you have confirmed that the tool's processing model is appropriate.",
    },
    text: {
      intro: "Text tools make common writing and text-cleanup tasks faster, from counting and case conversion to comparing, cleaning and preparing text for URLs. Most tasks can be completed by pasting text and reviewing the result immediately.",
      choosing: "Start with the simplest tool that matches your task. For cleanup, use the cleaner or duplicate-line tools; for presentation, use case conversion; for comparison, use the diff checker; and for publishing workflows, use the slug generator or word and character counters.",
    },
    files: {
      intro: "File and image tools help you inspect, compare, convert and reorganize common documents and images in your browser. Where a tool processes files locally, your files do not need to be uploaded to a server for that operation.",
      choosing: "Choose the tool based on the result you need: inspect metadata or dimensions when you need information, compare files when you need to find changes, and use conversion or organization tools when you need a new file. Always review the output before relying on it for an important document.",
    },
  };
  return guides[slug];
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const categoryTools = tools.filter((tool) => tool.category === (slug as ToolCategory) && tool.status === "live");
  const Icon = category.icon;
  const guide = getCategoryGuide(category.slug);
  const listJsonLd = { "@context": "https://schema.org", "@type": "ItemList", name: `${category.name} - Internet Toolbox`, numberOfItems: categoryTools.length, itemListElement: categoryTools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: `${siteUrl}/tools/${tool.slug}/` })) };

  return <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
    <SiteHeader />
    <section className="bg-white">
      <div className="container py-7 md:py-12">
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-black/40"><Link href="/" className="hover:text-black">Home</Link><span className="mx-2">/</span><Link href="/tools" className="hover:text-black">All tools</Link><span className="mx-2">/</span><span className="text-black/70">{category.name}</span></nav>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl"><div className="flex size-14 items-center justify-center rounded-2xl bg-[#e8f7c8] text-[#4d6815]"><Icon size={25} aria-hidden="true" /></div><p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#6d8e25]">Tool collection</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em] md:text-6xl">{category.name}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-black/55 md:text-lg">{category.description} Pick a tool and get straight to the task — no account, no complicated setup.</p></div>
          <div className="rounded-2xl border border-[#e1ded6] bg-[#faf9f6] px-5 py-4 lg:min-w-44"><p className="text-2xl font-black">{categoryTools.length}</p><p className="mt-1 text-xs font-semibold text-black/45">free tools available</p></div>
        </div>
      </div>
    </section>
    <section className="container py-10 md:py-14" aria-labelledby="category-tools-heading">
      <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d8e25]">Available now</p><h2 id="category-tools-heading" className="mt-1 text-2xl font-black md:text-3xl">Choose a tool</h2></div><Link href="/tools" className="inline-flex items-center gap-2 text-sm font-bold">All tools <ArrowRight size={15} /></Link></div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categoryTools.map((tool) => { const ToolIcon = tool.icon; return <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex min-h-44 min-w-0 flex-col rounded-2xl border border-[#e0ddd5] bg-white p-5 transition hover:-translate-y-1 hover:border-[#171717] hover:shadow-[0_14px_32px_rgba(23,23,23,.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]"><div className="flex items-start justify-between gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-[#edf6d9] text-[#4d6815]"><ToolIcon size={19} aria-hidden="true" /></span><ArrowRight size={17} className="mt-1 text-black/20 transition group-hover:translate-x-1 group-hover:text-black" aria-hidden="true" /></div><h3 className="mt-auto pt-7 text-sm font-extrabold leading-5">{tool.name}</h3><p className="mt-1.5 line-clamp-2 text-xs leading-5 text-black/45">{tool.description}</p><span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#66812b]"><Check size={12} aria-hidden="true" /> Free to use</span></Link>; })}</div>
    </section>
    <section className="border-y border-[#e4e1d9] bg-[#f2f0ea]" aria-labelledby="category-guide-heading"><div className="container py-10 md:py-14"><div className="grid gap-8 md:grid-cols-2 md:gap-12"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d8e25]">About this collection</p><h2 id="category-guide-heading" className="mt-2 text-2xl font-black md:text-3xl">What these tools are useful for</h2><p className="mt-4 text-sm leading-7 text-black/55">{guide.intro}</p></div><div className="rounded-2xl border border-[#dedbd3] bg-white p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d8e25]">How to choose</p><p className="mt-3 text-sm leading-7 text-black/55">{guide.choosing}</p></div></div></div></section>
    <section className="border-b border-[#e4e1d9] bg-[#f2f0ea]"><div className="container py-10 md:py-14"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d8e25]">Simple by design</p><h2 className="mt-2 text-2xl font-black md:text-3xl">Open. Do the thing. Done.</h2><p className="mt-3 text-sm leading-6 text-black/50">Every tool is designed to get you from question to result with as little friction as possible.</p></div></div></section>
    <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-5 py-9 text-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">Internet Toolbox</p><p className="mt-1 text-xs text-white/35">Small tools. Less hassle.</p></div><div className="flex flex-wrap gap-x-5 gap-y-2 text-white/50"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link></div></div></footer>
  </main>;
}
