import Link from "next/link";
import { Bug, Lightbulb, MessageCircle } from "lucide-react";
import SiteHeader from "@/components/site-header";

export const metadata = {
  title: "Support",
  description: "Get help, report a problem or suggest a useful tool for Internet Toolbox.",
};

const issueUrl = "https://github.com/factoalbum/internet-toolbox/issues/new";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <SiteHeader />

      <section className="border-b border-[#d8d4c9] bg-[#e8e4d9] py-14 md:py-20">
        <div className="container">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Support</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.045em] md:text-7xl">Need help?</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Tell us what went wrong or what would make Internet Toolbox more useful. Clear reports help us improve the tools.</p>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          <a href={issueUrl} target="_blank" rel="noreferrer" className="border border-[#d8d4c9] bg-[#fffdf8] p-6 transition hover:-translate-y-1 hover:border-[#171717] hover:shadow-[6px_6px_0_#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
            <Bug size={22} aria-hidden="true" />
            <h2 className="mt-8 text-xl font-black">Report a problem</h2>
            <p className="mt-2 text-sm leading-6 text-black/55">Something is broken, inaccurate or difficult to use? Open an issue and describe what happened.</p>
          </a>
          <a href={issueUrl} target="_blank" rel="noreferrer" className="border border-[#d8d4c9] bg-[#fffdf8] p-6 transition hover:-translate-y-1 hover:border-[#171717] hover:shadow-[6px_6px_0_#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
            <Lightbulb size={22} aria-hidden="true" />
            <h2 className="mt-8 text-xl font-black">Suggest a tool</h2>
            <p className="mt-2 text-sm leading-6 text-black/55">Have a repetitive task that should take seconds? Open an issue and describe the utility you would like.</p>
          </a>
          <a href="https://github.com/factoalbum/internet-toolbox/issues" target="_blank" rel="noreferrer" className="border border-[#d8d4c9] bg-[#fffdf8] p-6 transition hover:-translate-y-1 hover:border-[#171717] hover:shadow-[6px_6px_0_#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
            <MessageCircle size={22} aria-hidden="true" />
            <h2 className="mt-8 text-xl font-black">Browse discussions</h2>
            <p className="mt-2 text-sm leading-6 text-black/50">See existing reports and requests before opening a new one.</p>
          </a>
        </div>
        <div className="mx-auto mt-10 max-w-5xl border-t border-[#d8d4c9] pt-8 text-sm leading-7 text-black/50">
          <p>When reporting a calculation issue, include the tool name, the values you entered and the result you expected. Please do not include passwords, financial account numbers or other sensitive personal information.</p>
        </div>
      </section>

      <footer className="bg-[#171717] text-white"><div className="container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">Internet Toolbox</p><div className="flex flex-wrap gap-5 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/tools" className="hover:text-white">All tools</Link></div></div></footer>
    </main>
  );
}
