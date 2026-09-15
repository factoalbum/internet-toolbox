import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import SiteHeader from "@/components/site-header";
import ToolIcon from "@/components/tool-icon";
import { categories, tools, type ToolCategory } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";
export const dynamicParams = false;

const categoryGuidance: Record<ToolCategory, { title: string; body: string; questions: [string, string][] }> = {
  calculators: {
    title: "Choose the right calculator",
    body: "Use these calculators for quick estimates involving percentages, loans, taxes, investments, salary and everyday money decisions. Enter the values you know, check the assumptions shown with the result, and use the estimate as a starting point rather than a substitute for an official statement or professional advice.",
    questions: [
      ["Are these calculators free to use?", "Yes. The calculators on Internet Toolbox are free to use and do not require an account."],
      ["Are calculator results exact?", "Results are estimates based on the inputs and assumptions shown by each calculator. Important financial or tax figures should be checked against current official sources."],
    ],
  },
  trading: {
    title: "Trading tools for planning risk",
    body: "These tools help traders turn entry price, stop-loss, account size, fees and risk limits into simple planning figures. They are designed for scenario analysis and position planning, not for predicting markets or guaranteeing outcomes.",
    questions: [
      ["What can I calculate before a trade?", "You can estimate position size, risk, reward, stop-loss levels, take-profit targets, fees, break-even price and trading expectancy."],
      ["Do these tools provide investment advice?", "No. They perform calculations from the values you enter. They do not predict prices or recommend whether a trade should be taken."],
    ],
  },
  everyday: {
    title: "Quick tools for everyday tasks",
    body: "Use everyday tools when you need a fast answer without installing software or creating an account. Convert units and times, work with dates, split bills, calculate tips, generate random numbers or create a QR code directly in your browser.",
    questions: [
      ["Do I need an account to use these tools?", "No. Everyday tools are designed to work without an account or complicated setup."],
      ["Can I use these tools on a phone?", "Yes. The interfaces are responsive and designed for common mobile and desktop screen sizes."],
    ],
  },
  developer: {
    title: "Browser-based tools for developers",
    body: "These developer utilities cover common data and coding tasks such as JSON formatting, Base64 conversion, URL encoding, UUID generation, hashing, regular expressions, JWT inspection and timestamps. Where possible, processing happens locally in your browser so you can work without sending routine data to a server.",
    questions: [
      ["Is my developer data uploaded?", "Most developer tools process input locally in your browser. Check the processing note on an individual tool page for exceptions that use an external service."],
      ["Can I use these tools for production secrets?", "For sensitive credentials or secrets, prefer your organization's approved tools and workflows. Browser utilities should not replace your security controls."],
    ],
  },
  text: {
    title: "Simple text utilities",
    body: "Use text tools to clean pasted content, count words and characters, change letter case, remove duplicate lines, encode text or prepare a caption and message. They are built for quick transformations where you want a clear result without a full editor.",
    questions: [
      ["Can I use these text tools without signing in?", "Yes. The text tools are available without an account and are designed for quick browser-based tasks."],
      ["Will the tools rewrite my text automatically?", "Most text tools make direct transformations only. If a tool generates or rewrites copy, its page explains what the tool does before you use it."],
    ],
  },
  files: {
    title: "File and image tools that work in your browser",
    body: "Use these utilities for common PDF, document and image tasks such as merging, splitting, extracting text, checking metadata, comparing files and inspecting image dimensions. Many tools process files locally in the browser, which can reduce the need to upload ordinary documents to a third-party service.",
    questions: [
      ["Are my files uploaded to Internet Toolbox?", "Tools that support local processing keep the file in your browser. Each tool shows a processing note so you can check whether an external service is involved."],
      ["What file types are supported?", "Supported formats vary by tool. Check the individual tool page for accepted formats, size limits and any important limitations before processing a file."],
    ],
  },
};

export function generateStaticParams() {
  return categories.filter((category) => tools.some((tool) => tool.category === category.slug && tool.status === "live")).map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) return { title: "Category | Internet Toolbox", robots: { index: false, follow: false } };
  const title = `${category.name} | Internet Toolbox`;
  const description = `${category.description} Browse simple free tools from Internet Toolbox.`;
  const url = `${siteUrl}/categories/${slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const categoryTools = tools.filter((tool) => tool.category === (slug as ToolCategory) && tool.status === "live");
  const guidance = categoryGuidance[category.slug];
  const Icon = category.icon;
  const categoryUrl = `${siteUrl}/categories/${slug}/`;
  const listJsonLd = { "@context": "https://schema.org", "@type": "ItemList", name: `${category.name} - Internet Toolbox`, description: category.description, numberOfItems: categoryTools.length, itemListElement: categoryTools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: `${siteUrl}/tools/${tool.slug}/` })) };
  const pageJsonLd = [
    { "@context": "https://schema.org", "@type": "CollectionPage", name: `${category.name} tools`, description: category.description, url: categoryUrl },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` }, { "@type": "ListItem", position: 2, name: "All tools", item: `${siteUrl}/tools/` }, { "@type": "ListItem", position: 3, name: category.name, item: categoryUrl }] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: guidance.questions.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ];

  return <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([listJsonLd, ...pageJsonLd]) }} />
    <SiteHeader />
    <section className="bg-white">
      <div className="container py-5 sm:py-6 md:py-8">
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-black/40"><Link href="/" className="rounded px-1 py-1 hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Home</Link><span className="mx-2">/</span><Link href="/tools" className="rounded px-1 py-1 hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]">All tools</Link><span className="mx-2">/</span><span className="text-black/70" aria-current="page">{category.name}</span></nav>
        <div className="mt-5 flex flex-col gap-5 sm:mt-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex min-w-0 items-start gap-4">
            <ToolIcon icon={Icon} slug={category.slug} category={category.slug} size={23} className="size-12 sm:size-14" />
            <div className="min-w-0 max-w-3xl"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6d8e25] sm:text-xs">Tool collection</p><h1 className="mt-1 text-3xl font-black tracking-[-0.05em] sm:text-4xl md:text-5xl">{category.name}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-black/55 sm:text-base sm:leading-7">{category.description} Pick a tool and get straight to the task - no account, no complicated setup.</p></div>
          </div>
          <div className="w-full shrink-0 rounded-2xl border border-[#e1ded6] bg-[#faf9f6] px-4 py-3 sm:w-auto sm:min-w-40 sm:px-5 sm:py-4"><p className="text-2xl font-black">{categoryTools.length}</p><p className="mt-0.5 text-xs font-semibold text-black/45">free tools available</p></div>
        </div>
      </div>
    </section>
    <section className="container py-7 sm:py-8 md:py-10" aria-labelledby="category-tools-heading">
      <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d8e25]">Available now</p><h2 id="category-tools-heading" className="mt-1 text-2xl font-black md:text-3xl">Choose a tool</h2></div><Link href="/tools" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#c8f169]">All tools <ArrowRight size={15} /></Link></div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{categoryTools.map((tool) => { return <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex min-w-0 flex-col rounded-2xl border border-[#e0ddd5] bg-white p-3.5 aspect-square transition hover:-translate-y-1 hover:border-[#171717] hover:shadow-[0_14px_32px_rgba(23,23,23,.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] sm:aspect-auto sm:min-h-44 sm:p-5"><div className="flex items-start justify-between gap-2"><ToolIcon icon={tool.icon} slug={tool.slug} category={tool.category} size={17} className="size-9 sm:size-11" /><ArrowRight size={15} className="mt-0.5 shrink-0 text-black/20 transition group-hover:translate-x-1 group-hover:text-black sm:mt-1 sm:size-[17px]" aria-hidden="true" /></div><h3 className="mt-auto pt-3 text-xs font-extrabold leading-4 sm:pt-7 sm:text-sm sm:leading-5">{tool.name}</h3><p className="mt-1 line-clamp-2 text-[10px] leading-4 text-black/45 sm:mt-1.5 sm:text-xs sm:leading-5">{tool.description}</p><span className="mt-2 inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.1em] text-[#66812b] sm:mt-4 sm:gap-1.5 sm:text-[10px] sm:tracking-[0.12em]"><Check size={10} className="sm:hidden" aria-hidden="true" /><Check size={12} className="hidden sm:block" aria-hidden="true" /> Free to use</span></Link>; })}</div>
    </section>
    <section className="border-y border-[#e4e1d9] bg-white" aria-labelledby="category-guide-heading"><div className="container py-8 md:py-11"><div className="mx-auto max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d8e25]">Quick guide</p><h2 id="category-guide-heading" className="mt-2 text-2xl font-black tracking-[-0.03em] md:text-3xl">{guidance.title}</h2><p className="mt-3 text-sm leading-7 text-black/55 md:text-base">{guidance.body}</p><div className="mt-7 grid gap-4 md:grid-cols-2">{guidance.questions.map(([question, answer]) => <article key={question} className="rounded-2xl border border-[#e0ddd5] bg-[#faf9f6] p-5"><h3 className="text-sm font-black leading-5">{question}</h3><p className="mt-2 text-sm leading-6 text-black/55">{answer}</p></article>)}</div></div></div></section>
    <section className="border-b border-[#e4e1d9] bg-[#f2f0ea]"><div className="container py-8 md:py-12"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d8e25]">Simple by design</p><h2 className="mt-2 text-2xl font-black md:text-3xl">Open. Do the thing. Done.</h2><p className="mt-3 text-sm leading-6 text-black/50">Every tool is designed to get you from question to result with as little friction as possible.</p></div></div></section>
    <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-5 py-9 text-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">Internet Toolbox</p><p className="mt-1 text-xs text-white/35">Small tools. Less hassle.</p></div><div className="flex flex-wrap gap-x-5 gap-y-2 text-white/50"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link></div></div></footer>
  </main>;
}