import { Calculator, Code2, FileText } from "lucide-react";

export default function HomeIllustration() {
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-[500px] px-2 py-3 sm:px-4 lg:py-0">
      <div className="sm:hidden">
        <div className="mx-auto w-full max-w-[310px] overflow-hidden rounded-[24px] border border-[#dedbd3] bg-white p-2 shadow-[4px_4px_0_#171717]">
          <div className="flex items-center gap-1.5 border-b border-[#eeeae3] px-1 pb-2">
            <span className="size-2.5 rounded-full bg-[#ff8b8b]" />
            <span className="size-2.5 rounded-full bg-[#ffd45c]" />
            <span className="size-2.5 rounded-full bg-[#72d89a]" />
            <span className="ml-2 h-2 max-w-24 flex-1 rounded-full bg-[#f0eee8]" />
          </div>
          <div className="h-[126px] p-2.5">
            <div className="flex h-full items-center gap-3 rounded-2xl bg-[#f3f0e8] px-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#c8f169]">
                <Calculator size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="h-2.5 w-3/4 rounded-full bg-[#171717]/15" />
                <div className="mt-2 h-2 w-1/2 rounded-full bg-[#171717]/10" />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <span className="h-8 rounded-lg bg-white" />
                  <span className="h-8 rounded-lg bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="relative overflow-hidden rounded-[28px] border border-[#dedbd3] bg-white p-4 shadow-[8px_8px_0_#171717]">
          <div className="flex items-center gap-1.5 border-b border-[#eeeae3] px-1 pb-3">
            <span className="size-2.5 rounded-full bg-[#ff8b8b]" />
            <span className="size-2.5 rounded-full bg-[#ffd45c]" />
            <span className="size-2.5 rounded-full bg-[#72d89a]" />
            <span className="ml-2 h-2 max-w-32 flex-1 rounded-full bg-[#f0eee8]" />
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-2xl bg-[#f3f0e8] p-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#c8f169]"><Calculator size={21} /></div>
              <div className="mt-5 h-3 w-3/4 rounded-full bg-[#171717]/15" />
              <div className="mt-2 h-2 w-1/2 rounded-full bg-[#171717]/10" />
              <div className="mt-5 grid grid-cols-2 gap-2"><span className="h-9 rounded-lg bg-white" /><span className="h-9 rounded-lg bg-white" /></div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl bg-[#eaf5d3] p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-white"><Code2 size={18} /></div><div className="mt-3 h-2 w-2/3 rounded-full bg-[#171717]/15" /><div className="mt-2 h-2 w-1/2 rounded-full bg-[#171717]/10" /></div>
              <div className="rounded-2xl bg-[#f0eaff] p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-white"><FileText size={18} /></div><div className="mt-3 h-2 w-3/4 rounded-full bg-[#171717]/15" /><div className="mt-2 h-2 w-2/5 rounded-full bg-[#171717]/10" /></div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#171717] px-5 py-3 text-white">
            <div><div className="h-2.5 w-24 rounded-full bg-white/30" /><div className="mt-2 h-2 w-16 rounded-full bg-white/15" /></div>
            <span className="rounded-lg bg-[#c8f169] px-3 py-2 text-[10px] font-black text-[#171717]">OPEN TOOL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
