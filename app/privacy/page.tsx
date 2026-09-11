import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Privacy Policy",
  description: "How Internet Toolbox handles browser processing, external services, analytics, advertising cookies and privacy choices.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <SiteHeader />
      <section className="border-b border-[#d8d4c9] bg-[#e8e4d9] py-14 md:py-20"><div className="container"><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Privacy</p><h1 className="mt-4 text-5xl font-black tracking-[-0.045em] md:text-7xl">Privacy policy</h1><p className="mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">A plain-language explanation of what happens when you use Internet Toolbox.</p><p className="mt-4 text-xs font-semibold text-black/40">Last reviewed: September 10, 2026</p></div></section>
      <article className="container py-14 md:py-20"><div className="mx-auto max-w-3xl space-y-10 text-base leading-8 text-black/60">
        <section><h2 className="text-2xl font-black text-[#171717]">Tool data</h2><p className="mt-3">Many Internet Toolbox tools process input directly in your browser. For these tools, the text, files or values you enter are not sent to our server as part of the calculation or conversion. Tool pages identify cases where an external service is required.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Tools using external services</h2><p className="mt-3">Some tools need an external service, such as live currency or precious-metal reference data or URL shortening. When a tool uses an external service, the request may be sent to that provider. Check the tool&apos;s own explanation before using it with sensitive information.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Optional analytics</h2><p className="mt-3">If analytics are enabled, Internet Toolbox asks for consent before loading Google Analytics. Analytics are optional. Choosing not to consent prevents the analytics script from loading. The site can also be deployed without an analytics ID, in which case this consent prompt does not appear.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Cookies and local storage</h2><p className="mt-3">The site uses a small first-party consent cookie when analytics consent is selected so your choice can be remembered. Tool features may also use normal browser memory for temporary processing. When advertising is introduced, the privacy and consent information will be updated to describe the advertising technology and applicable choices.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Advertising</h2><p className="mt-3">Internet Toolbox may display Google AdSense or other advertising in the future to support the free service. Advertising technology can use cookies or similar technologies subject to applicable consent requirements. We will not place ads until the relevant integration, disclosures and consent controls have been reviewed.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Information you choose to publish</h2><p className="mt-3">If you submit a public issue or discussion through the project&apos;s support tracker, the information you choose to post may be visible to others according to the third-party platform&apos;s terms. Do not include passwords, payment credentials, government identification numbers or other sensitive information.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Security and responsible use</h2><p className="mt-3">No online service can guarantee absolute security. Avoid entering sensitive information into a tool unless its page explicitly explains why the information is needed and how it is handled.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Your questions</h2><p className="mt-3">For privacy questions or corrections, visit the <Link href="/contact" className="font-semibold underline underline-offset-4">contact page</Link>. For tool bugs and product suggestions, use <Link href="/support" className="font-semibold underline underline-offset-4">support</Link>.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Updates</h2><p className="mt-3">This policy may change as Internet Toolbox adds features or services. The current version is published on this page, with the review date shown above.</p></section>
      </div></article>
      <SiteFooter />
    </main>
  );
}
