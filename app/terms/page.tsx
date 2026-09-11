import Link from "next/link";
import SiteHeader from "@/components/site-header";

export const metadata = {
  title: "Terms of Use",
  description: "Terms for using the free online tools and services provided by Internet Toolbox.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <SiteHeader />
      <section className="border-b border-[#d8d4c9] bg-[#e8e4d9] py-14 md:py-20">
        <div className="container">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Legal</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.045em] md:text-7xl">Terms of use</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Simple rules for using Internet Toolbox responsibly.</p>
        </div>
      </section>
      <article className="container py-14 md:py-20">
        <div className="mx-auto max-w-3xl space-y-10 text-base leading-8 text-black/60">
          <section><h2 className="text-2xl font-black text-[#171717]">Use of the tools</h2><p className="mt-3">Internet Toolbox provides calculators, converters and utilities for general informational and practical use. You are responsible for checking results before relying on them for financial, legal, medical, business or other important decisions.</p></section>
          <section><h2 className="text-2xl font-black text-[#171717]">Accuracy and availability</h2><p className="mt-3">We aim to keep tools useful and accurate, but calculations, reference data and third-party services can change or contain errors. Tools may also be changed, interrupted or unavailable without notice.</p></section>
          <section><h2 className="text-2xl font-black text-[#171717]">External services</h2><p className="mt-3">Some tools use external services for reference data or link generation. Their availability and terms are outside our control. Use external results according to the relevant provider&apos;s terms.</p></section>
          <section><h2 className="text-2xl font-black text-[#171717]">Acceptable use</h2><p className="mt-3">Do not use the site to break the law, abuse third-party services, distribute harmful content, or interfere with the availability or security of the service.</p></section>
          <section><h2 className="text-2xl font-black text-[#171717]">Changes</h2><p className="mt-3">These terms may be updated as the service changes. Continued use of the site after an update means you accept the revised terms.</p></section>
          <section><h2 className="text-2xl font-black text-[#171717]">Questions</h2><p className="mt-3">For problems or suggestions, visit the <Link href="/support" className="font-semibold underline underline-offset-4">support page</Link>.</p></section>
        </div>
      </article>
      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link></div></div></footer>
    </main>
  );
}
