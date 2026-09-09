import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Wrench } from "lucide-react";
import SiteHeader from "@/components/site-header";
import AgeCalculator from "@/components/tools/age-calculator";
import Base64Tool from "@/components/tools/base64";
import BmiCalculator from "@/components/tools/bmi-calculator";
import CaseConverter from "@/components/tools/case-converter";
import CharacterCounter from "@/components/tools/character-counter";
import ColorConverter from "@/components/tools/color-converter";
import CompoundInterestCalculator from "@/components/tools/compound-interest-calculator";
import CurrencyConverter from "@/components/tools/currency-converter";
import DateCalculator from "@/components/tools/date-calculator";
import DiscountCalculator from "@/components/tools/discount-calculator";
import EmiCalculator from "@/components/tools/emi-calculator";
import FdCalculator from "@/components/tools/fd-calculator";
import GoldSilverConverter from "@/components/tools/gold-silver-converter";
import GstCalculator from "@/components/tools/gst-calculator";
import HraCalculator from "@/components/tools/hra-calculator";
import HtmlEntityTool from "@/components/tools/html-entity";
import ImageCompressor from "@/components/tools/image-compressor";
import IncomeTaxCalculator from "@/components/tools/income-tax-calculator";
import JsonFormatter from "@/components/tools/json-formatter";
import MessageWriter from "@/components/tools/message-writer";
import PasswordGenerator from "@/components/tools/password-generator";
import PercentageCalculator from "@/components/tools/percentage-calculator";
import PpfCalculator from "@/components/tools/ppf-calculator";
import RandomNumberGenerator from "@/components/tools/random-number-generator";
import SalaryCalculator from "@/components/tools/salary-calculator";
import SipCalculator from "@/components/tools/sip-calculator";
import SlugGenerator from "@/components/tools/slug-generator";
import TextCleaner from "@/components/tools/text-cleaner";
import TimeConverter from "@/components/tools/time-converter";
import TimestampConverter from "@/components/tools/timestamp-converter";
import UnitConverter from "@/components/tools/unit-converter";
import UrlEncoder from "@/components/tools/url-encoder";
import UrlShortener from "@/components/tools/url-shortener";
import DirectVideoDownloader from "@/components/tools/direct-video-downloader";
import UuidGenerator from "@/components/tools/uuid-generator";
import WordCounter from "@/components/tools/word-counter";
import TipCalculator from "@/components/tools/tip-calculator";
import { tools } from "@/lib/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const tool = tools.find((item) => item.slug === slug);
    return tool
      ? { title: tool.name, description: `${tool.description} Free to use.`, alternates: { canonical: `/tools/${tool.slug}` }, openGraph: { type: "website", title: tool.name, description: tool.description } }
      : {};
  });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) notFound();

  const Icon = tool.icon;
  const relatedTools = tools.filter((item) => item.category === tool.category && item.slug !== tool.slug && item.status === "live").slice(0, 3);
  const structuredData = { "@context": "https://schema.org", "@type": "WebApplication", name: tool.name, description: tool.description, url: `/tools/${tool.slug}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f0e8] text-[#171717]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SiteHeader />
      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-5xl min-w-0">
          <div className="flex min-w-0 items-start justify-between gap-6 border-b-2 border-[#171717] pb-8">
            <div className="min-w-0"><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Tool / {tool.category}</p><h1 className="mt-3 break-words text-4xl font-black tracking-[-0.04em] md:text-6xl">{tool.name}</h1><p className="mt-4 max-w-2xl break-words text-base leading-7 text-black/55 md:text-lg">{tool.description}</p></div>
            <div className="hidden size-14 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] md:flex"><Icon size={25} /></div>
          </div>
          <div className="mt-8 min-w-0">
            {slug === "percentage-calculator" && <PercentageCalculator />}
            {slug === "age-calculator" && <AgeCalculator />}
            {slug === "discount-calculator" && <DiscountCalculator />}
            {slug === "time-converter" && <TimeConverter />}
            {slug === "emi-calculator" && <EmiCalculator />}
            {slug === "gst-calculator" && <GstCalculator />}
            {slug === "bmi-calculator" && <BmiCalculator />}
            {slug === "sip-calculator" && <SipCalculator />}
            {slug === "unit-converter" && <UnitConverter />}
            {slug === "date-calculator" && <DateCalculator />}
            {slug === "fd-calculator" && <FdCalculator />}
            {slug === "compound-interest-calculator" && <CompoundInterestCalculator />}
            {slug === "income-tax-calculator" && <IncomeTaxCalculator />}
            {slug === "salary-calculator" && <SalaryCalculator />}
            {slug === "ppf-calculator" && <PpfCalculator />}
            {slug === "hra-calculator" && <HraCalculator />}
            {slug === "currency-converter" && <CurrencyConverter />}
            {slug === "gold-silver-rate-converter" && <GoldSilverConverter />}
            {slug === "random-number-generator" && <RandomNumberGenerator />}
            {slug === "tip-calculator" && <TipCalculator />}
            {slug === "url-shortener" && <UrlShortener />}
            {slug === "message-writer" && <MessageWriter />}
            {slug === "json-formatter" && <JsonFormatter />}
            {slug === "uuid-generator" && <UuidGenerator />}
            {slug === "password-generator" && <PasswordGenerator />}
            {slug === "url-encoder-decoder" && <UrlEncoder />}
            {slug === "base64-encoder-decoder" && <Base64Tool />}
            {slug === "timestamp-converter" && <TimestampConverter />}
            {slug === "color-converter" && <ColorConverter />}
            {slug === "html-entity-encoder-decoder" && <HtmlEntityTool />}
            {slug === "word-counter" && <WordCounter />}
            {slug === "character-counter" && <CharacterCounter />}
            {slug === "case-converter" && <CaseConverter />}
            {slug === "text-cleaner" && <TextCleaner />}
            {slug === "url-slug-generator" && <SlugGenerator />}
            {slug === "image-compressor" && <ImageCompressor />}
            {slug === "direct-video-downloader" && <DirectVideoDownloader />}
            {!tool.status.includes("live") && <div className="border border-[#d8d4c9] bg-[#fffdf8] p-8"><div className="flex min-h-64 flex-col items-center justify-center border border-dashed border-[#bcb8ae] text-center"><Wrench size={28} /><h2 className="mt-4 font-bold">Coming soon</h2><p className="mt-2 text-sm text-black/50">We are building this tool with the same straightforward experience.</p></div></div>}
          </div>
          {relatedTools.length > 0 && <section className="mt-12 border-t border-[#d8d4c9] pt-8" aria-labelledby="related-tools"><div className="flex items-end justify-between gap-4"><div className="min-w-0"><p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-black/40">More like this</p><h2 id="related-tools" className="mt-2 text-2xl font-black tracking-tight">Related tools</h2></div><Link href="/tools" className="hidden items-center gap-2 text-sm font-semibold sm:flex">View all<ArrowRight size={15} /></Link></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{relatedTools.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="group min-w-0 border border-[#d8d4c9] bg-[#fffdf8] p-4 transition hover:border-[#171717] hover:shadow-[5px_5px_0_#c8f169]"><h3 className="break-words font-bold">{item.name}</h3><p className="mt-2 break-words text-sm leading-6 text-black/50">{item.description}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em]">Open<ArrowRight size={13} className="transition group-hover:translate-x-1" /></span></Link>)}</div><Link href="/tools" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold sm:hidden">View all tools<ArrowRight size={15} /></Link></section>}
          <article className="mt-10 grid gap-6 border-t border-[#d8d4c9] pt-8 md:grid-cols-[.35fr_.65fr]"><h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-black/40">About this tool</h2><p className="break-words text-sm leading-7 text-black/55">Internet Toolbox provides online utilities for common tasks. The tools are designed to work in your browser where practical, with clear instructions and no account required.</p></article>
        </div>
      </section>
      <footer className="border-t border-[#d8d4c9] bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
    </main>
  );
}
