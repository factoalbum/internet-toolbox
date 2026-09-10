import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Contact",
  description: "Contact Internet Toolbox for support, corrections, accessibility feedback and general questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <SiteHeader />
      <section className="border-b border-[#d8d4c9] bg-[#e8e4d9] py-14 md:py-20">
        <div className="container">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Contact</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.045em] md:text-7xl">Talk to us</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Found an inaccurate result, accessibility issue, broken tool or something we should improve? We want to hear about it.</p>
        </div>
      </section>
      <section className="container py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] p-6 sm:p-8">
            <h2 className="text-2xl font-black">Product support</h2>
            <p className="mt-3 text-sm leading-7 text-black/55">For bugs, incorrect calculations, feature requests and tool suggestions, use the public support tracker. Include the tool name and reproducible steps, but never post passwords, payment details or other sensitive information.</p>
            <a href="https://github.com/factoalbum/internet-toolbox/issues/new" target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#171717] px-5 text-sm font-bold text-white">Open a support issue</a>
          </div>
          <div className="rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] p-6 sm:p-8">
            <h2 className="text-2xl font-black">Before contacting us</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-black/55">
              <li>• Check the tool&apos;s guide and limitations first.</li>
              <li>• For reference-data differences, include the source and approximate time.</li>
              <li>• For privacy questions, read the <Link href="/privacy" className="font-semibold underline underline-offset-4">Privacy Policy</Link>.</li>
              <li>• For general usage questions, the <Link href="/faq" className="font-semibold underline underline-offset-4">FAQ</Link> may answer them immediately.</li>
            </ul>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
