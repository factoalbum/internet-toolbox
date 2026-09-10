import Link from "next/link";
import SiteHeader from "@/components/site-header";

export const metadata = {
  title: "Privacy Policy",
  description: "How Internet Toolbox handles information, browser processing, analytics and cookies.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <SiteHeader />
      <section className="border-b border-[#d8d4c9] bg-[#e8e4d9] py-14 md:py-20"><div className="container"><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Privacy</p><h1 className="mt-4 text-5xl font-black tracking-[-0.045em] md:text-7xl">Privacy policy</h1><p className="mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">A plain-language explanation of what happens when you use Internet Toolbox.</p></div></section>
      <article className="container py-14 md:py-20"><div className="mx-auto max-w-3xl space-y-10 text-base leading-8 text-black/60">
        <section><h2 className="text-2xl font-black text-[#171717]">Tool data</h2><p className="mt-3">Many Internet Toolbox tools process input directly in your browser. For these tools, the text, files or values you enter are not sent to our server as part of the calculation or conversion.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Tools using external services</h2><p className="mt-3">Some tools need an external service, such as live currency or precious-metal reference data or URL shortening. When a tool uses an external service, the request may be sent to that provider. Check the tool&apos;s own explanation before using it with sensitive information.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Optional analytics</h2><p className="mt-3">If analytics are enabled, Internet Toolbox asks for consent before loading Google Analytics. Analytics are optional. Choosing &quot;No thanks&quot; prevents the analytics script from loading. The site can also be deployed without an analytics ID, in which case this consent prompt does not appear.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Cookies</h2><p className="mt-3">The site uses a small first-party consent cookie when analytics consent is selected so your choice can be remembered. Essential browser functionality may also use normal browser storage where needed. You can clear cookies through your browser settings.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Advertising</h2><p className="mt-3">Internet Toolbox may display advertising in the future to help support the free service. Any advertising integration will be subject to the provider&apos;s terms, consent requirements and applicable privacy rules.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Security and responsible use</h2><p className="mt-3">No online service can guarantee absolute security. Avoid entering passwords, payment credentials, government ID numbers or other sensitive information into a tool unless the tool explicitly requires it and explains how it is handled.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Updates</h2><p className="mt-3">This policy may change as Internet Toolbox adds features or services. The current version is published on this page.</p></section>
      </div></article>
      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
    </main>
  );
}
