import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Search } from "lucide-react";
import SiteHeader from "@/components/site-header";
import { categories, tools } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const category = categories.find((item) => item.slug === slug);
    if (!category) return {};
    const categoryUrl = `${siteUrl}/categories/${category.slug}/`;
    return {
      title: category.name,
      description: `${category.description} Browse free online tools from Internet Toolbox.`,
      alternates: { canonical: categoryUrl },
      openGraph: { type: "website", title: `${category.name} | Internet Toolbox`, description: category.description, url: categoryUrl },
      twitter: { card: "summary", title: `${category.name} | Internet Toolbox`, description: category.description },
    };
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const categoryTools = tools.filter((tool) => tool.category === category.slug);
  const liveTools = categoryTools.filter((tool) => tool.status === "live");
  const Icon = category.icon;
  const categoryUrl = `${siteUrl}/categories/${category.slug}/`;
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: category.name, description: category.description, numberOfItems: liveTools.length, itemListElement: liveTools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: `${siteUrl}/tools/${tool.slug}/` })) };
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` }, { "@type": "ListItem", position: 2, name: category.name, item: categoryUrl }] };

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([itemList, breadcrumbs]) }} />
      <SiteHeader />

      <section className="border-b border-[#dedbd3] bg-white">
        <div className="container py-8 md:py-10">
          <nav aria-label="Breadcrumb" className="text-xs text-black/40">
            <Link href="/" className="rounded-sm hover:text-black hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8f169]">Home</Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-black/70">{category.name}</span>
          </nav>

          <div className="mt-7 flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#c8f169]" aria-hidden="true"><Icon size={21} /></span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#66812b]">Tool collection</p>
              <h1 className="mt-1 break-words text-3xl font-black tracking-[-0.04em] md:text-5xl">{category.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50 md:text-base">{category.description}</p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/tools" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 text-xs font-bold text-white transition hover:bg-black/85 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]">
              <Search size={14} aria-hidden="true" /> Browse all tools
            </Link>
            <span className="text-xs font-semibold text-black/40">{liveTools.length} free tools in this collection</span>
          </div>

          <nav className="mt-7 flex gap-2 overflow-x-auto pb-1" aria-label="Other tool categories">
            {categories.map((item) => (
              <Link key={item.slug} href={`/categories/${item.slug}`} className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] ${item.slug === slug ? "border-[#171717] bg-[#171717] text-white" : "border-[#dedbd3] bg-[#faf9f6] text-black/60 hover:border-[#171717] hover:text-black"}`}>
                <item.icon size={13} aria-hidden="true" />{item.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="container py-8 md:py-12" aria-labelledby="collection-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/35">Available now</p>
            <h2 id="collection-heading" className="mt-1 text-xl font-black tracking-tight md:text-2xl">Pick a tool</h2>
          </div>
          <span className="hidden text-xs font-semibold text-black/35 sm:block">{liveTools.length} results</span>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => {
            const ToolIcon = tool.icon;
            const live = tool.status === "live";
            const featured = tool.slug === "developer-file-viewer";
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className={`group relative min-w-0 rounded-xl border bg-white p-4 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] ${live ? "border-[#dedbd3] hover:border-[#171717] hover:shadow-[0_8px_24px_rgba(23,23,23,.07)]" : "border-[#dedbd3] bg-[#f3f0e8]"}`}>
                {featured && <span className="absolute right-4 top-4 rounded-full bg-[#eaf4d2] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#526d1d]">File-first</span>}
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f0f4e8] text-black/75"><ToolIcon size={17} aria-hidden="true" /></span>
                  <div className="min-w-0 pr-2">
                    <h3 className="truncate text-sm font-extrabold">{tool.name}</h3>
                    <p className="mt-0.5 truncate text-[11px] text-black/40">{tool.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#eeeae3] pt-3">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${live ? "text-[#66812b]" : "text-black/30"}`}>
                    {live ? <><Check size={12} aria-hidden="true" /> Free</> : "Coming soon"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-black/35 transition group-hover:text-black">Open <ArrowRight size={12} className="transition group-hover:translate-x-0.5" aria-hidden="true" /></span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl border border-[#dedbd3] bg-white p-4 text-sm text-black/45 md:p-5">
          <p className="font-semibold text-black/70">Simple by design.</p>
          <p className="mt-1">Open a tool, do the task, and get your result. No account required for browser-based tools.</p>
        </div>
      </section>

      <footer className="border-t border-[#dedbd3] bg-white">
        <div className="container flex flex-col gap-4 py-7 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold">Internet Toolbox</p>
          <div className="flex flex-wrap gap-5 text-black/45">
            <Link href="/about" className="hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8f169]">About</Link>
            <Link href="/privacy" className="hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8f169]">Privacy</Link>
            <Link href="/terms" className="hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8f169]">Terms</Link>
            <Link href="/faq" className="hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8f169]">FAQ</Link>
            <Link href="/support" className="hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8f169]">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
