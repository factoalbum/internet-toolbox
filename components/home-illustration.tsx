import { Calculator, Code2, FileText, Image, Search, ShieldCheck, Sparkles, Type, Wrench } from "lucide-react";

const toolTypes = [
  { icon: Calculator, label: "Calculate", bg: "bg-[#eef8d8]", text: "text-[#4e7417]" },
  { icon: Code2, label: "Developer", bg: "bg-[#e8f1ff]", text: "text-[#315fba]" },
  { icon: FileText, label: "Files", bg: "bg-[#fff5cf]", text: "text-[#8a6410]" },
  { icon: Image, label: "Images", bg: "bg-[#f0e9ff]", text: "text-[#6245c8]" },
  { icon: Type, label: "Text", bg: "bg-[#ffe8e8]", text: "text-[#b33b43]" },
  { icon: Wrench, label: "Everyday", bg: "bg-[#e4f7ec]", text: "text-[#28734b]" },
];

export default function HomeIllustration() {
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-[560px] px-1 py-2 sm:px-3 lg:py-0">
      <div className="rounded-[28px] border border-[#dedbd3] bg-white p-2.5 shadow-[5px_5px_0_#171717] sm:rounded-[30px] sm:p-3.5 sm:shadow-[8px_8px_0_#171717]">
        <div className="flex items-center gap-1.5 border-b border-[#eeeae3] px-1 pb-2.5 sm:pb-3">
          <span className="size-2.5 rounded-full bg-[#ff8b8b]" />
          <span className="size-2.5 rounded-full bg-[#ffd45c]" />
          <span className="size-2.5 rounded-full bg-[#72d89a]" />
          <span className="ml-2 h-2 max-w-36 flex-1 rounded-full bg-[#f0eee8]" />
        </div>

        <div className="p-2.5 sm:p-5">
          <div className="text-center">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-[#f3f0e8] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-[#6b7280] sm:text-[10px]">
              <Sparkles size={11} className="text-[#6d8e25]" /> Your everyday toolbox
            </div>
            <div className="mt-3 text-base font-black tracking-[-.03em] sm:text-2xl">What do you need to do?</div>
            <div className="mx-auto mt-1 max-w-sm text-[10px] leading-4 text-[#7a8495] sm:text-xs">Find a simple tool. Finish the task. Move on.</div>
          </div>

          <div className="mt-4 flex h-10 items-center gap-2 rounded-xl border border-[#dedbd3] bg-[#fffdf8] px-3 sm:mt-5 sm:h-12 sm:rounded-2xl sm:px-4">
            <Search size={15} className="shrink-0 text-[#737d8e] sm:size-[17px]" />
            <span className="min-w-0 flex-1 truncate text-[10px] text-[#8992a1] sm:text-xs">Search calculators, PDF tools, text tools...</span>
            <span className="hidden rounded-lg bg-[#c8f169] px-2.5 py-1.5 text-[9px] font-black text-[#171717] sm:inline-flex">Search</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-2.5">
            {toolTypes.map(({ icon: Icon, label, bg, text }) => (
              <div key={label} className="rounded-xl border border-[#e8e4dc] bg-[#faf9f6] p-2 sm:rounded-2xl sm:p-3">
                <span className={`flex size-8 items-center justify-center rounded-lg ${bg} ${text} sm:size-9 sm:rounded-xl`}><Icon size={16} strokeWidth={1.9} /></span>
                <p className="mt-2 text-[9px] font-black text-[#293247] sm:text-[10px]">{label}</p>
                <p className="mt-0.5 hidden text-[9px] leading-3 text-[#8a92a0] sm:block">Simple tools</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-[#f2f0ea] p-2.5 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-white sm:size-8"><ShieldCheck size={15} className="text-[#5c7b1d]" /></span>
              <div>
                <p className="text-[9px] font-black sm:text-[10px]">Fast, private & free</p>
                <p className="text-[8px] text-[#7a8495] sm:text-[9px]">No sign up. Just get it done.</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#171717] px-3 py-2 text-[9px] font-black text-white sm:px-3.5">Explore tools <span aria-hidden="true">→</span></div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3 text-[9px] font-bold text-[#7a8495] sm:mt-4 sm:gap-5 sm:text-[10px]">
        <span>Calculate</span><span className="size-1 rounded-full bg-[#c8f169]" /><span>Convert</span><span className="size-1 rounded-full bg-[#d8c9ff]" /><span>Create</span><span className="size-1 rounded-full bg-[#ffd1d1]" /><span>Compare</span>
      </div>
    </div>
  );
}
