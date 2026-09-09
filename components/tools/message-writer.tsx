"use client";

import { useMemo, useState } from "react";
import { Copy, RotateCcw, Sparkles } from "lucide-react";

const options = [
  { value: "linkedin", label: "LinkedIn post" },
  { value: "birthday", label: "Birthday message" },
  { value: "leave", label: "Leave request" },
  { value: "congratulations", label: "Congratulations" },
  { value: "thank-you", label: "Thank you message" },
  { value: "announcement", label: "Professional announcement" },
  { value: "instagram", label: "Instagram caption" },
  { value: "email", label: "Professional email" },
] as const;

type Kind = (typeof options)[number]["value"];

type Tone = "professional" | "friendly" | "warm" | "confident" | "simple";

function buildMessage(kind: Kind, context: string, tone: Tone, length: "short" | "medium" | "long") {
  const clean = context.trim().replace(/\s+/g, " ");
  const detail = clean || "this update";
  const signoff = tone === "warm" ? "Thank you for being part of this." : tone === "friendly" ? "Really appreciate it." : "Thank you.";

  if (kind === "linkedin") {
    const lead = tone === "confident" ? "Proud to share an update." : tone === "friendly" ? "Excited to share a small update." : "I am happy to share an update.";
    const body = length === "short"
      ? `${lead}\n\n${detail}\n\nLooking forward to what comes next.`
      : length === "long"
        ? `${lead}\n\n${detail}\n\nThis experience has been a valuable reminder that progress comes from staying consistent, learning from the process and continuing to improve.\n\nGrateful for everyone who supported me along the way. Looking forward to the next chapter.`
        : `${lead}\n\n${detail}\n\nIt has been a great learning experience, and I am looking forward to building on this progress.`;
    return `${body}\n\n#Growth #Learning #Career`;
  }

  if (kind === "birthday") {
    return length === "short"
      ? `Happy Birthday! Wishing you a wonderful day filled with happiness and good memories. ${signoff}`
      : `Happy Birthday!\n\nWishing you a beautiful year ahead filled with happiness, good health and plenty of reasons to smile. ${detail ? `I hope ${detail} makes your day even more special.` : "Enjoy your special day."}\n\n${signoff}`;
  }

  if (kind === "leave") {
    return `Subject: Leave Request\n\nHi,\n\nI would like to request leave regarding ${detail}. I would appreciate your approval for the required leave period.\n\nI will make sure any important work is completed or handed over before my leave.\n\nThank you for your consideration.`;
  }

  if (kind === "congratulations") {
    return `Congratulations on ${detail}!\n\nThis is a well-deserved achievement. Wishing you continued success and many more milestones ahead. Keep going and keep growing!`;
  }

  if (kind === "thank-you") {
    return `Thank you so much for ${detail}.\n\nI genuinely appreciate your time, support and effort. It made a real difference, and I am grateful for it.\n\n${signoff}`;
  }

  if (kind === "announcement") {
    return `I am excited to share that ${detail}.\n\nThis is an important step for me, and I am looking forward to the work and learning that comes with it.\n\nThank you to everyone who has supported me along the way.`;
  }

  if (kind === "instagram") {
    return length === "short"
      ? `${detail} ✨\n\nOne step at a time.`
      : `${detail} ✨\n\nA moment worth remembering. Grateful for the journey, the lessons and the people who make it meaningful.\n\n#Life #Growth #GoodTimes`;
  }

  return `Hi,\n\nI am writing regarding ${detail}.\n\nI wanted to share the details and request your guidance on the next steps. Please let me know if you need any additional information from my side.\n\nThank you.\n\nBest regards`;
}

export default function MessageWriter() {
  const [kind, setKind] = useState<Kind>("linkedin");
  const [tone, setTone] = useState<Tone>("professional");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [context, setContext] = useState("");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState("");

  const generated = useMemo(() => buildMessage(kind, context, tone, length), [kind, context, tone, length]);

  function generate() {
    setResult(generated);
    setCopied(false);
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function reset() {
    setKind("linkedin");
    setTone("professional");
    setLength("medium");
    setContext("");
    setResult("");
    setCopied(false);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
      <section className="border border-[#d8d4c9] bg-[#fffdf8] p-5 sm:p-6" aria-labelledby="writer-input-heading">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#c8f169]"><Sparkles size={19} aria-hidden="true" /></span>
          <div><h2 id="writer-input-heading" className="font-bold">Give a little context</h2><p className="mt-1 text-sm leading-5 text-black/50">Write a few words. The tool will turn them into a ready-to-use message.</p></div>
        </div>

        <label className="mt-6 block text-sm font-semibold" htmlFor="message-type">What are you writing?</label>
        <select id="message-type" value={kind} onChange={(event) => setKind(event.target.value as Kind)} className="mt-2 min-h-11 w-full rounded-lg border border-[#bcb8ae] bg-white px-3 outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]">
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>

        <label className="mt-5 block text-sm font-semibold" htmlFor="message-context">Your context</label>
        <textarea id="message-context" value={context} onChange={(event) => setContext(event.target.value)} rows={6} maxLength={800} placeholder="Example: I completed my first project at work and learned a lot about backend development." className="mt-2 w-full resize-y rounded-lg border border-[#bcb8ae] bg-white p-3 text-sm leading-6 outline-none placeholder:text-black/30 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" />
        <p className="mt-1 text-right text-xs text-black/35">{context.length}/800</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className="text-sm font-semibold" htmlFor="message-tone">Tone</label><select id="message-tone" value={tone} onChange={(event) => setTone(event.target.value as Tone)} className="mt-2 min-h-11 w-full rounded-lg border border-[#bcb8ae] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]"><option value="professional">Professional</option><option value="friendly">Friendly</option><option value="warm">Warm</option><option value="confident">Confident</option><option value="simple">Simple</option></select></div>
          <div><label className="text-sm font-semibold" htmlFor="message-length">Length</label><select id="message-length" value={length} onChange={(event) => setLength(event.target.value as typeof length)} className="mt-2 min-h-11 w-full rounded-lg border border-[#bcb8ae] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]"><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></select></div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={generate} className="min-h-11 flex-1 rounded-lg bg-[#171717] px-5 text-sm font-bold text-white transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Create message</button><button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#bcb8ae] bg-white px-4 text-sm font-semibold hover:border-[#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><RotateCcw size={15} aria-hidden="true" />Reset</button></div>
      </section>

      <section className="border border-[#d8d4c9] bg-[#171717] p-5 text-white sm:p-6" aria-labelledby="writer-output-heading">
        <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Ready to use</p><h2 id="writer-output-heading" className="mt-1 text-xl font-black">Your message</h2></div><button type="button" onClick={copyResult} disabled={!result} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-30 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-[#c8f169]" aria-label="Copy generated message"><Copy size={14} aria-hidden="true" />{copied ? "Copied" : "Copy"}</button></div>
        <div className="mt-5 min-h-[360px] whitespace-pre-wrap rounded-lg border border-white/10 bg-white/[0.06] p-4 text-sm leading-7 text-white/85 sm:p-5">{result || "Your finished message will appear here."}</div>
        <p className="mt-3 text-xs leading-5 text-white/35">Review the result before sending, especially for work or formal requests.</p>
      </section>
    </div>
  );
}
