import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/site-header";
import { categories, tools } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export function generateStaticParams() { return categories.map((category) => ({ slug: category.slug })); }

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const category = categories.find((item) => item.slug === slug);
    if (!category) return {};
    const categoryUrl = `${siteUrl}/categories/${category.slug}/`;
    return { title: category.name, description: `${category.description} Browse free online tools from Internet Toolbox.`, alternates: { canonical: categoryUrl }, openGraph: { type: "website", title: `${category.name} | Internet Toolbox`, description: category.description, url: categoryUrl }, twitter: { card: "summary", title: `${category.name} | Internet Toolbox`, description: category.description } };
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

  return <main className="min-h-screen overflow-x-clip bg-[#fffdf8] text-[#171717]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([itemList, breadcrumbs]) }} />
    <SiteHeader />
    <section className="border-b border-[#dedbd3] bg-[#f3f0e8]">
      <div className="container py-11 md:py-14">
        <nav aria-label="Breadcrumb" className="mb-7 text-xs text-black/45"><Link href="/" className="hover:text-black hover:underline">Home</Link><span className="mx-2">/</span><span className="font-semibold text-black">{category.name}</span></nav>
        <div className="flex min-w-0 items-start justify-between gap-6">
          <div className="min-w-0 max-w-3xl"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#66812b]">Tool collection</p><h1 className="mt-3 break-words text-5xl font-black tracking-[-0.055em] md:text-7xl">{category.name}</h1><p className="mt-5 max-w-2xl break-words text-base leading-7 text-black/55 md:text-lg">{category.description}</p><p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-black/40">{liveTools.length} free tools</p></div>
          <span className="hidden size-14 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] md:flex" aria-hidden="true"><Icon size={25} /></span>
        </div>
        <nav className="mt-8 flex gap-2 overflow-x-auto pb-1" aria-label="Other tool categories">
          {categories.map((item) => <Link key={item.slug} href={`/categories/${item.slug}`} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-bold transition focus:outline-none focus:ring-4 focus:ring-[#c8f169] ${item.slug === slug ? "border-[#171717] bg-[#171717] text-white" : "border-[#cfcac0] bg-white hover:border-[#171717]"}`}><item.icon size={13} aria-hidden="true" />{item.name}</Link>)}
        </nav>
      </div>
    </section>
    <section className="container py-10 md:py-14" aria-labelledby="collection-heading">
      <div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/35">Collection</p><h2 id="collection-heading" className="mt-2 text-2xl font-black tracking-tight">{category.name} tools</h2></div><Link href="/tools" className="hidden items-center gap-2 text-xs font-bold sm:inline-flex">All tools <ArrowRight size={13} /></Link></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => { const ToolIcon = tool.icon; const live = tool.status === "live"; return <Link key={tool.slug} href={`/tools/${tool.slug}`} className={`group min-w-0 rounded-xl border p-5 transition focus:outline-none focus:ring-4 focus:ring-[#c8f169] ${live ? "border-[#dedbd3] bg-white hover:-translate-y-0.5 hover:border-[#171717] hover:shadow-[5px_5px_0_#c8f169]" : "border-[#dedbd3] bg-[#f3f0e8]"}`}><div className="flex items-start justify-between gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#eef6da]"><ToolIcon size={17} aria-hidden="true" /></span><span className={`text-[10px] font-bold uppercase tracking-[0.14em] ${live ? "text-[#66812b]" : "text-black/30"}`}>{live ? "Free" : "Soon"}</span></div><h3 className="mt-6 break-words text-base font-extrabold">{tool.name}</h3><p className="mt-2 break-words text-xs leading-5 text-black/50">{tool.description}</p><span className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em]">{live ? "Open tool" : "Coming soon"}<ArrowRight size={12} className="transition group-hover:translate-x-1" aria-hidden="true" /></span></Link>; })}
      </div>
      <div className="mt-9 border-t border-[#dedbd3] pt-6"><p className="text-sm text-black/45">Free online tools, designed for quick everyday tasks.</p></div>
    </section>
    <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
  </main>;
}
