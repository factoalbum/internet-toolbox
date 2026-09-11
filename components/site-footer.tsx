import Link from "next/link";

const footerLinks = [
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Disclaimer", "/disclaimer"],
  ["FAQ", "/faq"],
  ["Support", "/support"],
] as const;

const footerLinkClass =
  "inline-flex min-h-10 items-center rounded-lg px-2 text-white/55 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8f169] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#dedbd3] bg-[#171717] text-white">
      <div className="container flex flex-col gap-6 py-9 text-sm sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-black">Internet Toolbox</p>
          <p className="mt-1 max-w-xs text-xs leading-5 text-white/45">
            Practical browser tools for everyday tasks, with privacy and clear explanations built in.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
          {footerLinks.map(([label, href]) => (
            <Link key={href} href={href} className={footerLinkClass}>
              {label}
            </Link>
          ))}
          <Link
            href="/tools"
            className={`${footerLinkClass} font-semibold text-white hover:bg-white/10`}
          >
            All tools
          </Link>
        </nav>
      </div>
    </footer>
  );
}
