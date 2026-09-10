import Link from "next/link";
import CategorySidebar from "@/components/category-sidebar";

type SiteHeaderProps = {
  sticky?: boolean;
};

export default function SiteHeader({ sticky = false }: SiteHeaderProps) {
  return (
    <header className={`${sticky ? "sticky top-0 z-20 " : ""}border-b border-[#d8d4c9] bg-[#f3f0e8]/95 backdrop-blur`}>
      <div className="container flex min-h-[64px] items-center justify-between gap-4 py-2">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-md focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
          aria-label="Internet Toolbox home"
        >
          <span className="flex size-8 shrink-0 items-center justify-center border border-[#171717] bg-[#171717] text-xs font-bold text-white" aria-hidden="true">IT</span>
          <span className="truncate text-[15px] font-bold tracking-tight">Internet Toolbox</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/tools"
            className="hidden rounded-md px-3 py-2 text-sm font-semibold text-black/60 transition hover:bg-black/5 hover:text-[#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169] sm:inline-flex"
          >
            All tools
          </Link>
          <CategorySidebar />
        </div>
      </div>
    </header>
  );
}
