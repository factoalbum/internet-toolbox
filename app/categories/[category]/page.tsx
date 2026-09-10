import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
    openGraph: {
      title: `${category.name} | Internet Toolbox`,
      description: `${category.description} Browse simple free tools from Internet Toolbox.`,
      url: `${siteUrl}/categories/${slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) return null;

  const categoryTools = tools.filter((tool) => tool.category === (slug as ToolCategory) && tool.status === "live");
  const Icon = category.icon;
  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.name} - Internet Toolbox`,
    numberOfItems: categoryTools.length,
    itemListElement: categoryTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${siteUrl}/tools/${tool.slug}/`,
    })),
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
      <SiteHeader />
      <section className="border-b border-[#e4e1d9] bg-white">
        <div className="container py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-black/40">
            <Link href="/" className="hover:text-black hover:underline">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-black hover:underline">All tools</Link>
            <span>/</span>
            <span className="font-semibold text-black">{category.name}</span>
          </nav>
          <div className="max-w-3xl">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#e9f4cf] text-[#425515]"><Icon size={22} aria-hidden="true" /></span>
            <p className="mt-6 text-xs font-bold text-[#6d8e25]">CATEGORY</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.045em] md:text-6xl">{category.name}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50 md:text-base">{category.description} Pick a tool below and get straight to the task.</p>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14" aria-labelledby="category-tools-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#6d8e25]">{categoryTools.length} TOOLS</p>
            <h2 id="category-tools-heading" className="mt-1 text-2xl font-black">Choose a tool</h2>
          </div>
          <Link href="/tools" className="hidden items-center gap-2 text-sm font-bold sm:inline-flex">All tools <ArrowRight size={15} /></Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => {
            const ToolIcon = tool.icon;
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-2xl border border-[#e1ded6] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#171717] hover:shadow-[0_8px_24px_rgba(23,23,23,.07)] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#f0eee8]"><ToolIcon size={19} aria-hidden="true" /></span>
                  <ArrowRight size={15} className="text-black/20 transition group-hover:translate-x-1 group-hover:text-black" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-extrabold">{tool.name}</h3>
                <p className="mt-2 text-sm leading-6 text-black/50">{tool.description}</p>
                <span className="mt-5 inline-flex text-xs font-bold">Open tool</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[#e4e1d9] bg-[#f2f0ea]">
        <div className="container py-8">
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-bold hover:underline"><ArrowLeft size={15} /> Back to all tools</Link>
        </div>
      </section>
      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/50"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link></div></div></footer>
    </main>
  );
}
