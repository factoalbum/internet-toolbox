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
type Length = "short" | "medium" | "long";

const contextHints: Record<Kind, { placeholder: string; help: string }> = {
  linkedin: {
    placeholder: "Example: Completed my first backend project at CargoForce. Built APIs with NestJS and learned a lot about security and testing.",
    help: "Include what happened, your role, the result or lesson, and anything you want to thank.",
  },
  birthday: {
    placeholder: "Example: My younger sister. She is kind, always supports me, and I want this to feel personal and warm.",
    help: "Tell us who the person is and one or two things that make the message personal.",
  },
  leave: {
    placeholder: "Example: Need leave on 18 and 19 September for a family function. I will finish the release task before leaving.",
    help: "Include the dates, reason if you want to share it, and any work or handover details.",
  },
  congratulations: {
    placeholder: "Example: My friend got promoted to Senior Software Engineer after working hard on a major project.",
    help: "Tell us what they achieved and who they are to you.",
  },
  "thank-you": {
    placeholder: "Example: Thank my manager for giving me the opportunity to lead the project and helping me when I was stuck.",
    help: "Say what you are thankful for and who you are thanking.",
  },
  announcement: {
    placeholder: "Example: I joined a new company as a Backend Developer after completing my BSc in Computer Science.",
    help: "Include the announcement, your new role or milestone, and what you are looking forward to.",
  },
  instagram: {
    placeholder: "Example: Finished my first major project after months of learning and late nights. Feeling proud of the progress.",
    help: "Describe the moment, feeling or story behind the post.",
  },
  email: {
    placeholder: "Example: Need to ask my manager for approval to work from home on Friday because of a family appointment.",
    help: "Include the purpose, important details, and the action you need from the recipient.",
  },
};

function cleanContext(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function sentenceCase(value: string) {
  const clean = cleanContext(value);
  if (!clean) return "";
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function buildMessage(kind: Kind, context: string, tone: Tone, length: Length) {
  const clean = cleanContext(context);
  const detail = sentenceCase(clean) || "your recent update";
  const isShort = length === "short";
  const isLong = length === "long";

  if (kind === "linkedin") {
    const lead = tone === "confident"
      ? "Proud to share an update."
      : tone === "friendly"
        ? "Excited to share a little update."
        : tone === "warm"
          ? "I am grateful to share an update."
          : "I am happy to share an update.";
    if (isShort) return `${lead}\n\n${detail}`;
    if (isLong) {
      return `${lead}\n\n${detail}\n\nThis has been a valuable experience, and I am glad to have learned through the process. The challenges, feedback and small improvements along the way have helped me grow.\n\nGrateful to the people who supported me through it. Looking forward to what comes next.`;
    }
    return `${lead}\n\n${detail}\n\nIt has been a valuable learning experience, and I am looking forward to building on this progress.`;
  }

  if (kind === "birthday") {
    if (isShort) return `Happy Birthday! Wishing you happiness, good health and a wonderful year ahead.`;
    return `Happy Birthday!\n\n${detail}\n\nWishing you a beautiful year ahead filled with happiness, good health and plenty of good memories. I hope you have a day that feels as special as you are.\n\nHave a wonderful birthday!`;
  }

  if (kind === "leave") {
    return `Subject: Leave Request\n\nHi,\n\nI would like to request leave for ${detail}.\n\nI will make sure any important work is completed or properly handed over before the leave period. Please let me know if you need any additional information from my side.\n\nThank you for your consideration.\n\nBest regards`;
  }

  if (kind === "congratulations") {
    return isShort
      ? `Congratulations on ${clean || "this achievement"}! Wishing you many more successes ahead.`
      : `Congratulations on ${clean || "this achievement"}!\n\nThis is a well-deserved milestone. Your hard work has clearly paid off, and I hope this is the beginning of many more great achievements.\n\nWishing you continued success ahead.`;
  }

  if (kind === "thank-you") {
    return isShort
      ? `Thank you so much for ${clean || "your support"}. I really appreciate it.`
      : `Thank you so much for ${clean || "your support"}.\n\nI genuinely appreciate the time, effort and support you gave me. It made a real difference, and I am grateful for it.\n\nThank you again.`;
  }

  if (kind === "announcement") {
    const opening = tone === "confident" ? "Proud to announce" : tone === "friendly" ? "Excited to share" : "I am happy to share";
    return isShort
      ? `${opening}: ${clean || "an important update"}.`
      : `${opening}: ${clean || "an important update"}.\n\nThis is an important step for me, and I am looking forward to the work, learning and opportunities ahead.\n\nThank you to everyone who has supported me along the way.`;
  }

  if (kind === "instagram") {
    if (isShort) return `${detail}\n\nOne step at a time.`;
    return `${detail}\n\nA moment worth remembering. Grateful for the journey, the lessons and the people who make it meaningful.`;
  }

  return `Subject: ${clean || "Request"}\n\nHi,\n\nI am writing regarding ${detail}.\n\nI wanted to share the details and request your guidance on the next steps. Please let me know if you need any additional information from my side.\n\nThank you.\n\nBest regards`;
}

export default function MessageWriter() {
  const [kind, setKind] = useState<Kind>("linkedin");
  const [tone, setTone] = useState<Tone>("professional");
  const [length, setLength] = useState<Length>("medium");
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
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setKind("linkedin");
    setTone("professional");
    setLength("medium");
    setContext("");
    setResult("");
    setCopied(false);
  }

  const hint = contextHints[kind];

  return (
    <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
      <section className="border border-[#d8d4c9] bg-[#fffdf8] p-5 sm:p-6" aria-labelledby="writer-input-heading">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#c8f169]"><Sparkles size={19} aria-hidden="true" /></span>
          <div><h2 id="writer-input-heading" className="font-bold">Give a little context</h2><p className="mt-1 text-sm leading-5 text-black/50">The more specific your details, the more relevant the result will be. You do not need to write it perfectly.</p></div>
        </div>

        <label className="mt-6 block text-sm font-semibold" htmlFor="message-type">What are you writing?</label>
        <select id="message-type" value={kind} onChange={(event) => { setKind(event.target.value as Kind); setResult(""); }} className="mt-2 min-h-11 w-full rounded-lg border border-[#bcb8ae] bg-white px-3 outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]">
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>

        <label className="mt-5 block text-sm font-semibold" htmlFor="message-context">What happened?</label>
        <textarea id="message-context" value={context} onChange={(event) => { setContext(event.target.value); setResult(""); }} rows={7} maxLength={1200} placeholder={hint.placeholder} className="mt-2 w-full resize-y rounded-lg border border-[#bcb8ae] bg-white p-3 text-sm leading-6 outline-none placeholder:text-black/30 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" />
        <div className="mt-1 flex justify-between gap-3 text-xs text-black/35"><span>{hint.help}</span><span className="shrink-0">{context.length}/1200</span></div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className="text-sm font-semibold" htmlFor="message-tone">Tone</label><select id="message-tone" value={tone} onChange={(event) => { setTone(event.target.value as Tone); setResult(""); }} className="mt-2 min-h-11 w-full rounded-lg border border-[#bcb8ae] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]"><option value="professional">Professional</option><option value="friendly">Friendly</option><option value="warm">Warm</option><option value="confident">Confident</option><option value="simple">Simple</option></select></div>
          <div><label className="text-sm font-semibold" htmlFor="message-length">Length</label><select id="message-length" value={length} onChange={(event) => { setLength(event.target.value as Length); setResult(""); }} className="mt-2 min-h-11 w-full rounded-lg border border-[#bcb8ae] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]"><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></select></div>
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
