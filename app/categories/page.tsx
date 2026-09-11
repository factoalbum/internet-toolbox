import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/site-header";
import ToolIcon from "@/components/tool-icon";
import { categories, tools } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";
const pageUrl = `${siteUrl}/categories/`;

export const metadata: Metadata = {
  title: "Tool Categories | Internet Toolbox",
  description: "Browse Internet Toolbox by category: calculators, everyday tools, developer tools, text tools, and file tools.",
  alternates: { canonical: pageUrl },
  openGraph: { title: "Tool Categories | Internet Toolbox", description: "Browse Internet Toolbox by category: calculators, everyday tools, developer tools, text tools, and file tools.", url: pageUrl, type: "website" },
  twitter: { card: "summary", title: "Tool Categories | Internet Toolbox", description: "Browse Internet Toolbox by category: calculators, everyday tools, developer tools, text tools, and file tools." },
};

const guidance = [
  ["Money & Calculators", "Use these tools for quick estimates involving percentages, loans, savings, tax, salary and investments. Confirm important figures against current official information."],
  ["Everyday Tools", "Choose this category for dates, time, units, bill sharing and other small tasks where you need a quick answer without an account."],
  ["Developer Tools", "Use these tools for common coding and data tasks such as JSON formatting, UUID generation, regex testing and encoding. Avoid entering sensitive data when your security requirements prohibit it."],
  ["Text Tools", "Choose text tools when you need to clean, count, compare or transform pasted text for writing, publishing, URLs or content checks."],
  ["File & Image Tools", "Use these tools for common PDF and image tasks. Tools that process files locally identify that behavior, while tools using an external service identify it clearly."],
];

export default function CategoriesPage() {
  const liveCategories = categories.filter((category) => tools.some((tool) => tool.category === category.slug && tool.status === "live"));

  return <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
    <SiteHeader />
    <section className="border-b border-[#e4e1d9]"><div className="container py-10 md:py-16"><nav aria-label="Breadcrumb" className="mb-8 text-xs text-black/40"><Link href="/" className="rounded px-1 py-1 hover:text-black hover:underline focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Home</Link><span className="mx-2">/</span><span className="font-semibold text-black">Categories</span></nav><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#6d8e25]">Browse the toolbox</p><h1 className="mt-3 text-4xl font-black tracking-[-0.045em] md:text-6xl">Find tools by task.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-black/50 md:text-base">Choose a category and go straight to the tools you need. No deep menus.</p></div></div></section>
    <section className="container py-8 md:py-12" aria-labelledby="categories-heading"><h2 id="categories-heading" className="sr-only">Tool categories</h2><div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">{liveCategories.map((category) => { const count = tools.filter((tool) => tool.category === category.slug && tool.status === "live").length; return <Link key={category.slug} href={`/categories/${category.slug}`} className="group flex min-w-0 min-h-44 flex-col rounded-2xl border border-[#dedbd3] bg-white p-3.5 shadow-[0_3px_12px_rgba(23,23,23,.025)] transition hover:-translate-y-0.5 hover:border-[#171717] hover:shadow-[0_12px_28px_rgba(23,23,23,.07)] focus:outline-none focus:ring-4 focus:ring-[#c8f169] sm:p-5"><div className="flex items-start justify-between gap-2"><ToolIcon icon={category.icon} slug={category.slug} category={category.slug} size={17} className="size-9 sm:size-11" /><ArrowRight size={15} className="mt-1 shrink-0 text-black/25 transition group-hover:translate-x-1 group-hover:text-black sm:size-[17px]" aria-hidden="true" /></div><h3 className="mt-auto pt-4 break-words text-xs font-black leading-4 sm:mt-6 sm:pt-0 sm:text-lg sm:leading-normal">{category.name}</h3><p className="mt-1 line-clamp-2 break-words text-[10px] leading-4 text-black/50 sm:mt-2 sm:text-sm sm:leading-6">{category.description}</p><p className="mt-2 text-[9px] font-bold text-[#6d8e25] sm:mt-5 sm:text-xs">{count} free tools</p></Link>; })}</div></section>
    <section className="border-y border-[#e4e1d9] bg-white" aria-labelledby="guidance-heading"><div className="container py-10 md:py-14"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#6d8e25]">Choose the right category</p><h2 id="guidance-heading" className="mt-2 text-2xl font-black tracking-[-.035em] md:text-3xl">Start with the kind of task you have.</h2><p className="mt-3 text-sm leading-6 text-black/55 md:text-base">Each category groups tools by the job they help you complete, so you can choose a useful starting point without browsing the whole catalogue.</p></div><div className="mt-8 grid gap-4 md:grid-cols-2">{guidance.filter(([name]) => liveCategories.some((category) => category.name === name)).map(([name, text]) => <section key={name} className="rounded-2xl border border-[#e0ddd5] bg-[#faf9f6] p-5"><h3 className="text-sm font-black">{name}</h3><p className="mt-2 text-sm leading-6 text-black/55">{text}</p></section>)}</div></div></section>
    <section className="border-y border-[#e4e1d9] bg-[#f2f0ea]"><div className="container flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-black">Know the tool name?</p><p className="mt-1 text-sm text-black/50">Search the full toolbox instead.</p></div><Link href="/tools" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Browse all tools <ArrowRight size={15} aria-hidden="true" /></Link></div></section>
    <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/50"><Link href="/about" className="rounded px-1 py-1 hover:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">About</Link><Link href="/privacy" className="rounded px-1 py-1 hover:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Privacy</Link><Link href="/terms" className="rounded px-1 py-1 hover:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Terms</Link><Link href="/faq" className="rounded px-1 py-1 hover:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">FAQ</Link><Link href="/support" className="rounded px-1 py-1 hover:text-white focus:text-white focus:ring-4 focus:ring-[#c8f169]">Support</Link></div></div></footer>
  </main>;
}
