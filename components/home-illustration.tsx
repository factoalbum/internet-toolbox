import { Code2, FileText, Sparkles } from "lucide-react";

export default function HomeIllustration() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[1.08/1] w-full max-w-[620px]">
      <div className="absolute left-[4%] top-[8%] h-28 w-28 rotate-[-7deg] rounded-2xl bg-[#d8ff8a] p-4 shadow-[0_12px_30px_rgba(23,23,23,.08)] sm:h-32 sm:w-32">
        <p className="text-sm font-black leading-tight text-[#172015] sm:text-base">Tools<br />For<br />A Better<br />You</p>
      </div>
      <div className="absolute right-[5%] top-[12%] h-28 w-32 rotate-[6deg] rounded-2xl bg-[#eee3ff] p-4 shadow-[0_12px_30px_rgba(23,23,23,.08)] sm:h-32 sm:w-36">
        <p className="text-sm font-black leading-tight text-[#272040] sm:text-base">Small<br />Tools<br />Big<br />Impact</p>
      </div>
      <div className="absolute left-[20%] top-[5%] w-40 rounded-xl border border-[#ddd9f0] bg-white p-3 shadow-[0_14px_35px_rgba(23,23,23,.08)] sm:w-48">
        <div className="mb-3 flex gap-1"><i className="size-2 rounded-full bg-[#ff8b8b]" /><i className="size-2 rounded-full bg-[#ffd45c]" /><i className="size-2 rounded-full bg-[#72d89a]" /></div>
        <div className="flex gap-2"><span className="flex size-8 items-center justify-center rounded-md bg-[#6555ee] text-white"><FileText size={16} /></span><div className="flex-1 space-y-1.5 pt-1"><span className="block h-1.5 w-4/5 rounded bg-[#d7d3ee]" /><span className="block h-1.5 w-3/5 rounded bg-[#e6e3f2]" /><span className="block h-1.5 w-2/3 rounded bg-[#e6e3f2]" /></div></div>
      </div>
      <div className="absolute right-[20%] top-[9%] w-36 rotate-[4deg] rounded-xl bg-white/90 p-3 shadow-[0_12px_28px_rgba(23,23,23,.06)] sm:w-44">
        <div className="flex items-center gap-2 text-xs font-bold"><span className="flex size-7 items-center justify-center rounded-lg bg-[#e8f8c9] text-[#53731b]"><Code2 size={15} /></span>Build · Learn</div>
        <div className="mt-2 space-y-1.5"><span className="block h-1.5 w-full rounded bg-[#d9d5ea]" /><span className="block h-1.5 w-4/5 rounded bg-[#e9e6f0]" /></div>
      </div>
      <div className="absolute bottom-[5%] left-[5%] h-24 w-24 rounded-[45%] bg-[#e8e0ff] blur-[1px] sm:h-32 sm:w-32" />
      <div className="absolute bottom-[3%] right-[9%] h-36 w-28 rounded-[45%] bg-[#e4f5c5] sm:h-44 sm:w-36" />

      <svg viewBox="0 0 600 430" className="absolute inset-x-[3%] bottom-0 h-[78%] w-[94%] overflow-visible">
        <path d="M45 386H555" stroke="#171b2b" strokeWidth="3" strokeLinecap="round" />
        <path d="M103 230h260l-8 14H95z" fill="#fff" stroke="#171b2b" strokeWidth="3" />
        <path d="M111 244v142M350 244v142" stroke="#171b2b" strokeWidth="3" />
        <path d="M112 300h238" stroke="#e2dfe8" strokeWidth="2" />
        <path d="M390 249h91v137h-91z" fill="#fbfbfb" stroke="#171b2b" strokeWidth="3" />
        <path d="M400 386h90M400 320h90" stroke="#171b2b" strokeWidth="3" />
        <path d="M176 230c-10-48 6-105 55-111 43-5 70 22 75 61l13 58-70 12z" fill="#5949ed" />
        <path d="M242 125c-5-28 11-49 37-50 27-1 45 19 40 46l-5 27-62 3z" fill="#f2b88a" stroke="#171b2b" strokeWidth="3" />
        <circle cx="284" cy="83" r="35" fill="#f2b88a" />
        <path d="M250 78c2-32 28-49 54-38 15 6 22 18 22 31-19-7-30-19-35-31-7 22-22 34-41 38z" fill="#171b2b" />
        <circle cx="297" cy="86" r="3" fill="#171b2b" /><path d="M304 98q8 6 14 0" fill="none" stroke="#171b2b" strokeWidth="2" strokeLinecap="round" />
        <path d="M203 142l-39 55-39-5 44-76z" fill="#f2b88a" stroke="#171b2b" strokeWidth="3" />
        <path d="M159 191l-39-1-18-24" fill="none" stroke="#171b2b" strokeWidth="8" strokeLinecap="round" />
        <path d="M237 124l83 35 25 70-76 10-37-61z" fill="#171b2b" />
        <path d="M321 159l51-65 51 22-38 90-57 24z" fill="#171b2b" />
        <path d="M327 113l32-63c9-17 30-24 47-16 17 8 24 28 17 45l-31 76z" fill="#5949ed" />
        <path d="M371 385l-42-1 3-88 55-3z" fill="#ece7ff" stroke="#171b2b" strokeWidth="3" />
        <path d="M328 296l-5 91-36-1 8-91z" fill="#d8ff8a" stroke="#171b2b" strokeWidth="3" />
        <path d="M371 385l55 1" stroke="#171b2b" strokeWidth="7" strokeLinecap="round" />
        <path d="M287 385l-44 1" stroke="#171b2b" strokeWidth="7" strokeLinecap="round" />
        <rect x="241" y="191" width="117" height="55" rx="5" fill="#101827" stroke="#171b2b" strokeWidth="3" transform="rotate(7 241 191)" />
        <rect x="251" y="198" width="96" height="38" rx="3" fill="#c9c6ff" opacity=".35" transform="rotate(7 251 198)" />
        <path d="M290 216l13 8 12-18" fill="none" stroke="#d8ff8a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M423 235c21 8 34 27 36 53" fill="none" stroke="#171b2b" strokeWidth="5" strokeLinecap="round" />
        <path d="M464 291c0-37 22-65 45-87" fill="none" stroke="#171b2b" strokeWidth="4" strokeLinecap="round" />
        <path d="M486 211c14-18 21-31 22-45M486 211c-18-9-30-20-37-35M486 211c18 3 32 0 46-8" stroke="#22a866" strokeWidth="13" strokeLinecap="round" />
        <path d="M130 386c0-31 26-51 53-51 28 0 50 20 50 51z" fill="#171b2b" />
        <path d="M153 372q18-16 36 0" fill="none" stroke="#6555ee" strokeWidth="3" />
        <circle cx="165" cy="370" r="3" fill="#fff" /><circle cx="180" cy="370" r="3" fill="#fff" />
        <path d="M382 362c0-25 27-34 52-22 21 10 31 28 25 46h-80z" fill="#f5c14b" stroke="#171b2b" strokeWidth="3" />
        <circle cx="427" cy="359" r="17" fill="#fff" /><path d="M419 358l-4-10 10 6 9-5-3 11" fill="#f5c14b" />
        <circle cx="422" cy="362" r="2.5" fill="#171b2b" /><circle cx="436" cy="362" r="2.5" fill="#171b2b" />
      </svg>
      <div className="absolute bottom-[20%] left-[6%] hidden items-center gap-2 rounded-full border border-white bg-white px-3 py-2 text-[11px] font-bold shadow-[0_8px_20px_rgba(23,23,23,.08)] sm:flex"><Sparkles size={13} className="text-[#6555ee]" /> Everything stays in your browser</div>
    </div>
  );
}
