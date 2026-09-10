import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/site-header";
import { categories, tools } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export const metadata: Metadata = {
  title: "Tool Categories | Internet Toolbox",
  description: "Browse Internet Toolbox by category: calculators, everyday tools, developer tools, text tools, and file tools.",
  alternates: { canonical: `${siteUrl}/categories` },
};

export default function CategoriesPage() {
  return <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
    <SiteHeader />
    <section className="border-b border-[#e4e1d9]">
      <div className="container py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-black/40"><Link href="/" className="hover:text-black hover:underline">Home</Link><span className="mx-2">/</span><span className="font-semibold text-black">Categories</span></nav>
        <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#6d8e25]">Browse the toolbox</p><h1 className="mt-3 text-4xl font-black tracking-[-0.045em] md:text-6xl">Find tools by task.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-black/50 md:text-base">Choose a category and go straight to the tools you need. No deep menus.</p></div>
      </div>
    </section>
    <section className="container py-8 md:py-12" aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="sr-only">Tool categories</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const count = tools.filter((tool) => tool.category === category.slug && tool.status === "live").length;
          return <Link key={category.slug} href={`/categories/${category.slug}`} className="group rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-[0_3px_12px_rgba(23,23,23,.025)] transition hover:-translate-y-0.5 hover:border-[#171717] hover:shadow-[0_12px_28px_rgba(23,23,23,.07)] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
            <div className="flex items-start justify-between gap-4"><span className="flex size-12 items-center justify-center rounded-xl bg-[#e9f4cf] text-[#425515]"><Icon size={22} /></span><ArrowRight size={17} className="mt-1 text-black/25 transition group-hover:translate-x-1 group-hover:text-black" /></div>
            <h3 className="mt-6 text-lg font-black">{category.name}</h3><p className="mt-2 text-sm leading-6 text-black/50">{category.description}</p><p className="mt-5 text-xs font-bold text-[#6d8e25]">{count} free tools</p>
          </Link>;
        })}
      </div>
    </section>
    <section className="border-y border-[#e4e1d9] bg-[#f2f0ea]"><div className="container flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-black">Know the tool name?</p><p className="mt-1 text-sm text-black/50">Search the full toolbox instead.</p></div><Link href="/tools" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Browse all tools <ArrowRight size={15} /></Link></div></section>
    <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/50"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link></div></div></footer>
  </main>;
}
