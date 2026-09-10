import { Calculator, Code2, FileText, Image as ImageIcon, Sparkles } from "lucide-react";

export default function HomeIllustration() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[1.18/1] w-full max-w-[600px] sm:aspect-[1.28/1] lg:aspect-[1.08/1]">
      <div className="absolute inset-[8%_4%_5%] rounded-[32px] bg-[#eaf5d3] sm:inset-[7%_4%_4%]" />
      <div className="absolute left-[7%] top-[18%] size-16 rounded-[20px] bg-[#d9ccff] sm:left-[4%] sm:top-[22%] sm:size-20" />
      <div className="absolute right-[7%] top-[12%] size-20 rounded-full bg-[#d8ff8a] sm:right-[5%] sm:top-[16%] sm:size-24" />

      <div className="absolute left-[3%] top-[9%] hidden items-center gap-2 rounded-full border border-white bg-white px-3 py-2 text-[11px] font-bold shadow-[0_8px_22px_rgba(23,23,23,.08)] sm:flex">
        <Sparkles size={13} className="text-[#6555ee]" /> Simple tools, less hassle
      </div>
      <div className="absolute right-[3%] bottom-[12%] hidden items-center gap-2 rounded-full border border-white bg-white px-3 py-2 text-[11px] font-bold shadow-[0_8px_22px_rgba(23,23,23,.08)] sm:flex">
        <span className="size-2 rounded-full bg-[#6bbf58]" /> Runs in your browser
      </div>

      <svg viewBox="0 0 620 480" className="absolute inset-x-[2%] bottom-0 h-[92%] w-[96%] overflow-visible" role="presentation">
        <rect x="74" y="66" width="472" height="332" rx="24" fill="#171b2b" opacity=".08" transform="translate(7 9)" />
        <rect x="74" y="58" width="472" height="332" rx="24" fill="#fffdf8" stroke="#171b2b" strokeWidth="4" />
        <path d="M74 112h472" stroke="#dedbd3" strokeWidth="3" />
        <circle cx="103" cy="85" r="7" fill="#ff8b8b" />
        <circle cx="126" cy="85" r="7" fill="#ffd45c" />
        <circle cx="149" cy="85" r="7" fill="#72d89a" />

        <rect x="104" y="139" width="412" height="64" rx="14" fill="#f3f0e8" />
        <circle cx="132" cy="171" r="16" fill="#c8f169" />
        <path d="M126 171h12M132 165v12" stroke="#171b2b" strokeWidth="3" strokeLinecap="round" />
        <rect x="159" y="161" width="154" height="8" rx="4" fill="#171b2b" opacity=".82" />
        <rect x="159" y="177" width="104" height="6" rx="3" fill="#171b2b" opacity=".18" />
        <rect x="422" y="158" width="66" height="27" rx="13.5" fill="#fff" stroke="#dedbd3" strokeWidth="2" />
        <circle cx="438" cy="171.5" r="5" fill="#6555ee" />
        <rect x="448" y="167" width="27" height="7" rx="3.5" fill="#171b2b" opacity=".2" />

        <rect x="104" y="223" width="126" height="126" rx="18" fill="#eef7d8" stroke="#d8d4c9" strokeWidth="2" />
        <circle cx="167" cy="264" r="23" fill="#c8f169" />
        <Calculator x="151" y="248" width="32" height="32" strokeWidth="2.4" color="#171b2b" />
        <rect x="128" y="303" width="78" height="7" rx="3.5" fill="#171b2b" opacity=".18" />
        <rect x="141" y="319" width="52" height="6" rx="3" fill="#171b2b" opacity=".1" />

        <rect x="247" y="223" width="126" height="126" rx="18" fill="#f0eaff" stroke="#d8d4c9" strokeWidth="2" />
        <circle cx="310" cy="264" r="23" fill="#6555ee" />
        <Code2 x="294" y="248" width="32" height="32" strokeWidth="2.4" color="#fff" />
        <rect x="271" y="303" width="78" height="7" rx="3.5" fill="#171b2b" opacity=".18" />
        <rect x="284" y="319" width="52" height="6" rx="3" fill="#171b2b" opacity=".1" />

        <rect x="390" y="223" width="126" height="126" rx="18" fill="#fff4d9" stroke="#d8d4c9" strokeWidth="2" />
        <circle cx="453" cy="264" r="23" fill="#f5c14b" />
        <ImageIcon x="437" y="248" width="32" height="32" strokeWidth="2.4" color="#171b2b" />
        <rect x="414" y="303" width="78" height="7" rx="3.5" fill="#171b2b" opacity=".18" />
        <rect x="427" y="319" width="52" height="6" rx="3" fill="#171b2b" opacity=".1" />

        <path d="M184 414h252" stroke="#171b2b" strokeWidth="4" strokeLinecap="round" />
        <path d="M245 414l-18 20h166l-18-20" fill="#fffdf8" stroke="#171b2b" strokeWidth="3" strokeLinejoin="round" />
        <rect x="259" y="429" width="102" height="8" rx="4" fill="#171b2b" opacity=".14" />
        <path d="M452 398c13 0 23 10 23 23" fill="none" stroke="#6555ee" strokeWidth="5" strokeLinecap="round" />
        <path d="M475 421l12 11" stroke="#6555ee" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
