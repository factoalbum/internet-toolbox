import Link from "next/link";
import { ArrowRight, Calculator, Code2, FileImage, FileText, Search, ShieldCheck, Sparkles } from "lucide-react";
import ToolSearch from "@/components/tool-search";
import SiteHeader from "@/components/site-header";
import { categories, featuredTools, tools } from "@/lib/tools";

const quickTools = [
  { slug: "percentage-calculator", label: "Calculate a percentage" },
  { slug: "discount-calculator", label: "Find a sale price" },
  { slug: "emi-calculator", label: "Calculate loan EMI" },
  { slug: "currency-converter", label: "Convert currency" },
  { slug: "message-writer", label: "Write a LinkedIn post" },
  { slug: "unit-converter", label: "Convert units" },
  { slug: "gold-silver-rate-converter", label: "Check gold and silver" },
];

const taskCards = [
  { label: "Money", title: "Work out money", text: "EMI, GST, salary, tax, discounts and investments.", href: "/categories/calculators", icon: Calculator },
  { label: "Everyday", title: "Convert or calculate", text: "Percentages, age, dates, time, units and more.", href: "/categories/calculators", icon: FileText },
  { label: "Writing", title: "Write something", text: "Turn a few words into a LinkedIn post, message, request or caption.", href: "/tools/message-writer", icon: Sparkles },
  { label: "Work", title: "Get something done", text: "Clean text, shorten URLs and prepare content.", href: "/categories/text", icon: FileText },
  { label: "Tech", title: "Solve a developer task", text: "Format JSON, generate UUIDs, encode data and check values.", href: "/categories/developer", icon: Code2 },
  { label: "Files", title: "Fix a file", text: "Compress images and handle common file tasks in your browser.", href: "/categories/files", icon: FileImage },
];

const featured = featuredTools.slice(0, 8);

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f0e8] text-[#171717]">
      <SiteHeader sticky />

      <section className="border-b border-[#d8d4c9] bg-[#fffdf8]">
        <div className="container py-12 md:py-18 lg:py-22">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#5f7429]">Simple online tools for real-life tasks</p>
            <h1 className="text-5xl font-black leading-[0.96] tracking-[-0.055em] md:text-7xl">What do you need<br className="hidden sm:block" /> to get done?</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Calculate, convert, check, clean and create without figuring out how the tool works first.</p>
          </div>

          <div className="mx-auto mt-9 max-w-3xl border border-[#171717] bg-[#f3f0e8] p-3 shadow-[6px_6px_0_#171717] sm:p-4">
            <div className="mb-3 flex items-center gap-2 px-1 text-sm font-bold"><Search size={17} className="text-black/40" aria-hidden="true" /><span>What are you trying to do?</span></div>
            <ToolSearch />
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Popular tasks">
              {quickTools.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="rounded-full border border-[#d8d4c9] bg-[#fffdf8] px-3 py-2 text-xs font-semibold text-black/65 transition hover:border-[#171717] hover:bg-[#c8f169] hover:text-[#171717]">{item.label}</Link>)}
            </div>
          </div>

          <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-black/40">
            <span>{tools.length} tools</span>
            <span>Free to use</span>
            <span>No account needed</span>
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20" aria-labelledby="tasks-heading">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/35">Start with the job</p>
          <h2 id="tasks-heading" className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Choose what you are trying to do</h2>
          <p className="mt-3 text-sm leading-6 text-black/50">You do not need to know the name of a calculator. Start with the task and we will take you there.</p>
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {taskCards.map(({ label, title, text, href, icon: Icon }) => <Link key={title} href={href} className="group min-h-44 min-w-0 border border-[#d8d4c9] bg-[#fffdf8] p-5 transition hover:-translate-y-0.5 hover:border-[#171717] hover:shadow-[5px_5px_0_#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
            <div className="flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-lg bg-[#edf7d5]"><Icon size={18} aria-hidden="true" /></span><ArrowRight size={16} className="text-black/25 transition group-hover:translate-x-1 group-hover:text-black" /></div>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.15em] text-black/35">{label}</p>
            <h3 className="mt-1 text-lg font-bold tracking-tight">{title}</h3>
            <p className="mt-1.5 text-sm leading-5 text-black/50">{text}</p>
          </Link>)}
        </div>
      </section>

      <section className="border-y border-[#d8d4c9] bg-[#e8e4d9]" aria-labelledby="popular-heading">
        <div className="container py-14 md:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-black/35">Popular tools</p><h2 id="popular-heading" className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Tools people use most</h2></div>
            <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-bold">See every tool<ArrowRight size={15} /></Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((tool) => { const Icon = tool.icon; return <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group min-w-0 border border-[#d8d4c9] bg-[#fffdf8] p-5 transition hover:border-[#171717] hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
              <div className="flex items-start justify-between gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#edf7d5]"><Icon size={18} aria-hidden="true" /></span><ArrowRight size={15} className="text-black/25 transition group-hover:translate-x-1 group-hover:text-black" /></div>
              <h3 className="mt-7 break-words text-base font-bold tracking-tight">{tool.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-black/50">{tool.description}</p>
            </Link>; })}
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20" aria-labelledby="categories-heading">
        <div className="grid gap-8 md:grid-cols-[.7fr_1.3fr] md:items-start">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-black/35">Everything in one place</p><h2 id="categories-heading" className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Browse by category</h2><p className="mt-4 max-w-sm text-sm leading-6 text-black/50">Find money tools, everyday utilities, developer tools, text tools and file tools in one place.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category) => { const Icon = category.icon; return <Link key={category.slug} href={`/categories/${category.slug}`} className="group flex min-w-0 gap-4 border border-[#d8d4c9] bg-[#fffdf8] p-5 transition hover:border-[#171717] hover:bg-[#c8f169] focus:outline-none focus:ring-4 focus:ring-[#171717] focus:ring-inset"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f3f0e8]"><Icon size={19} aria-hidden="true" /></span><span className="min-w-0"><span className="flex items-center gap-2 font-bold">{category.name}<ArrowRight size={14} className="opacity-25 transition group-hover:translate-x-1 group-hover:opacity-100" /></span><span className="mt-1 block break-words text-sm leading-5 text-black/50">{category.description}</span></span></Link>; })}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d8d4c9] bg-[#171717] text-white">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center"><ShieldCheck className="mx-auto text-[#c8f169]" size={25} aria-hidden="true" /><h2 className="mt-4 text-2xl font-black tracking-tight md:text-3xl">Built to be useful, not complicated</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/55">Clear labels, sensible defaults and straightforward results. When a task can safely run in your browser, we keep it there.</p></div>
          <div className="mt-9 grid gap-3 text-sm sm:grid-cols-3"><div className="border border-white/10 bg-white/5 p-5"><p className="font-bold">1. Tell us the task</p><p className="mt-2 text-white/45">Search by what you want to accomplish.</p></div><div className="border border-white/10 bg-white/5 p-5"><p className="font-bold">2. Enter the basics</p><p className="mt-2 text-white/45">Only enter the information the tool needs.</p></div><div className="border border-white/10 bg-white/5 p-5"><p className="font-bold">3. Get the answer</p><p className="mt-2 text-white/45">Results are shown clearly so you can use them right away.</p></div></div>
        </div>
      </section>

      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 border-t border-white/10 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/50"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
    </main>
  );
}
