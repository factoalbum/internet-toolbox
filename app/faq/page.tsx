import Link from "next/link";
import SiteHeader from "@/components/site-header";

export const metadata = {
  title: "FAQ",
  description: "Answers about Internet Toolbox tools, privacy, calculations, browser processing and usage.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  ["Are Internet Toolbox tools free?", "Yes. The tools are designed to be free to use and do not require an account for normal use."],
  ["Do I need to install anything?", "No. Internet Toolbox is designed to work in a modern web browser on phones, tablets and computers."],
  ["Is my data uploaded?", "Many tools process inputs directly in your browser. Tools that need an external service are clearly identified and may send the required data to that service."],
  ["Can I use the calculators for financial decisions?", "Use calculator results as estimates, not professional financial advice. Rates, rules, fees and personal circumstances can change the actual result."],
  ["How accurate are the currency and gold rates?", "Market-data tools use reference data from external providers and can differ from a bank, exchange, jeweller, local bullion board or another data source."],
  ["Why is a result different from Google or my bank?", "Different services can use different providers, timestamps, spreads, rounding and local pricing. Internet Toolbox shows reference calculations rather than promising an exact match to another service."],
  ["Can I suggest a new tool?", "Yes. Visit the support page and describe the everyday task you want to make faster."],
  ["How can I report a wrong result?", "Open the support page and include the tool name, values entered and expected result. Do not include passwords or sensitive account information."],
];

export default function FaqPage() {
  const structuredData = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SiteHeader />
      <section className="border-b border-[#d8d4c9] bg-[#e8e4d9] py-14 md:py-20">
        <div className="container">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Help center</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.045em] md:text-7xl">Frequently asked questions</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Straight answers about our tools, privacy, calculations and data.</p>
        </div>
      </section>
      <section className="container py-14 md:py-20">
        <div className="mx-auto max-w-3xl divide-y divide-[#d8d4c9] border-y border-[#d8d4c9] bg-[#fffdf8]">
          {faqs.map(([question, answer]) => <details key={question} className="group p-5 sm:p-6"><summary className="cursor-pointer list-none pr-8 text-lg font-bold outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]">{question}<span className="float-right text-black/30 transition group-open:rotate-45" aria-hidden="true">+</span></summary><p className="mt-4 max-w-2xl text-sm leading-7 text-black/55">{answer}</p></details>)}
        </div>
        <div className="mx-auto mt-10 max-w-3xl border border-[#171717] bg-[#c8f169] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6"><div><h2 className="font-black">Still stuck?</h2><p className="mt-1 text-sm text-black/60">Report a problem or suggest a useful tool.</p></div><Link href="/support" className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#171717] px-5 text-sm font-bold text-white sm:mt-0">Visit support</Link></div>
      </section>
      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
    </main>
  );
}
