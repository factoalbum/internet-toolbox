import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "How Internet Toolbox handles information when you use the site and its tools.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <header className="border-b border-[#d8d4c9] bg-[#f3f0e8]">
        <div className="container flex h-[68px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Internet Toolbox home">
            <span className="flex size-8 items-center justify-center border border-[#171717] bg-[#171717] text-xs font-bold text-white" aria-hidden="true">IT</span>
            <span className="text-[15px] font-semibold">Internet Toolbox</span>
          </Link>
          <Link href="/tools" className="flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-black/60 hover:bg-black/5"><ArrowLeft size={15} /> All tools</Link>
        </div>
      </header>

      <section className="border-b border-[#d8d4c9] bg-[#e8e4d9] py-14 md:py-20">
        <div className="container">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Privacy</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.045em] md:text-7xl">Privacy policy</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/55">A plain-language explanation of what happens when you use Internet Toolbox.</p>
        </div>
      </section>

      <article className="container py-14 md:py-20">
        <div className="mx-auto max-w-3xl space-y-10 text-base leading-8 text-black/60">
          <section><h2 className="text-2xl font-black text-[#171717]">Tool data</h2><p className="mt-3">Many Internet Toolbox tools process input directly in your browser. For these tools, the text or values you enter are not sent to our server as part of the calculation or conversion.</p></section>
          <section><h2 className="text-2xl font-black text-[#171717]">Site usage</h2><p className="mt-3">Like most public websites, the site may use standard technical information such as browser type, device information and basic request data for security, reliability and performance. If analytics or advertising services are enabled, those providers may process information according to their own policies.</p></section>
          <section><h2 className="text-2xl font-black text-[#171717]">Advertising</h2><p className="mt-3">Internet Toolbox may display advertising in the future to help support the free service. Advertising providers can use cookies or similar technologies where permitted to measure performance and show relevant ads. Any advertising integration will be subject to the provider&apos;s terms and applicable privacy requirements.</p></section>
          <section><h2 className="text-2xl font-black text-[#171717]">Cookies</h2><p className="mt-3">Some parts of the site may use cookies or local browser storage for essential functionality, preferences, analytics or advertising. You can control cookies through your browser settings and, where required, the site&apos;s consent controls.</p></section>
          <section><h2 className="text-2xl font-black text-[#171717]">Third-party services</h2><p className="mt-3">External services, such as hosting, analytics or advertising providers, may process limited information when their features are used. Their own privacy policies govern that processing.</p></section>
          <section><h2 className="text-2xl font-black text-[#171717]">Updates</h2><p className="mt-3">This policy may be updated as Internet Toolbox adds features or services. The current version will always be published on this page.</p></section>
        </div>
      </article>

      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
    </main>
  );
}
