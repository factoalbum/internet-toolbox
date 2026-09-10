import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
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
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.name,
    description: category.description,
    numberOfItems: liveTools.length,
    itemListElement: liveTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${siteUrl}/tools/${tool.slug}/`,
    })),
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: category.name, item: categoryUrl },
    ],
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f0e8] text-[#171717]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([itemList, breadcrumbs]) }} />
      <SiteHeader />
      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-6 overflow-x-auto whitespace-nowrap text-sm text-black/50">
            <ol className="flex min-w-max items-center gap-2">
              <li><Link href="/" className="rounded-sm underline-offset-4 hover:text-[#171717] hover:underline">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-[#171717]">{category.name}</li>
            </ol>
          </nav>
          <div className="flex min-w-0 items-start justify-between gap-6 border-b-2 border-[#171717] pb-8">
            <div className="min-w-0">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Category / Tool index</p>
              <h1 className="mt-3 break-words text-4xl font-black tracking-[-0.04em] md:text-6xl">{category.name}</h1>
              <p className="mt-4 max-w-2xl break-words text-base leading-7 text-black/55 md:text-lg">{category.description}</p>
              <p className="mt-3 text-sm font-semibold text-black/45">{liveTools.length} free tools available</p>
            </div>
            <div className="hidden size-14 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] md:flex" aria-hidden="true"><Icon size={25} /></div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {categoryTools.map((tool, index) => {
              const ToolIcon = tool.icon;
              return <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex min-h-52 min-w-0 flex-col border border-[#d8d4c9] bg-[#fffdf8] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#171717] hover:shadow-[7px_7px_0_#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><div className="flex items-start justify-between gap-3"><span className="font-mono text-xs text-black/30">{String(index + 1).padStart(2, "0")}</span><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#edf7d5]" aria-hidden="true"><ToolIcon size={20} /></span></div><div className="mt-auto min-w-0"><h2 className="break-words text-xl font-bold tracking-tight">{tool.name}</h2><p className="mt-2 break-words text-sm leading-6 text-black/50">{tool.description}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">{tool.status === "live" ? "Use tool" : "Coming soon"}<ArrowRight size={14} aria-hidden="true" className="transition group-hover:translate-x-1" /></span></div></Link>;
            })}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#d8d4c9] pt-6 text-sm">
            <p className="text-black/50">Free online tools with no account required.</p>
            <Link href="/tools" className="inline-flex min-h-11 items-center gap-2 font-semibold hover:underline">Browse all tools<ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <footer className="border-t border-[#d8d4c9] bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
    </main>
  );
}
