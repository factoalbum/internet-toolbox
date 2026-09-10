import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#dedbd3] bg-[#171717] text-white">
      <div className="container flex flex-col gap-6 py-9 text-sm sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-black">Internet Toolbox</p>
          <p className="mt-1 max-w-xs text-xs leading-5 text-white/45">Practical browser tools for everyday tasks, with privacy and clear explanations built in.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 text-white/55 sm:grid-cols-3">
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
          <Link href="/faq" className="hover:text-white">FAQ</Link>
          <Link href="/support" className="hover:text-white">Support</Link>
          <Link href="/tools" className="font-semibold text-white">All tools</Link>
        </nav>
      </div>
    </footer>
  );
}
