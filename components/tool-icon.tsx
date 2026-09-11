import type { LucideIcon } from "lucide-react";
import type { ToolCategory } from "@/lib/tools";

type ToolIconProps = {
  icon: LucideIcon;
  slug?: string;
  category?: ToolCategory;
  size?: number;
  className?: string;
};

const accents = [
  { bg: "bg-[#eef8d8]", text: "text-[#4e7417]" },
  { bg: "bg-[#e8f1ff]", text: "text-[#315fba]" },
  { bg: "bg-[#fff5cf]", text: "text-[#8a6410]" },
  { bg: "bg-[#f0e9ff]", text: "text-[#6245c8]" },
  { bg: "bg-[#ffe8e8]", text: "text-[#b33b43]" },
  { bg: "bg-[#e4f7ec]", text: "text-[#28734b]" },
] as const;

const categoryBase: Record<ToolCategory, number> = {
  calculators: 0,
  trading: 3,
  everyday: 2,
  developer: 1,
  text: 4,
  files: 5,
};

function accentIndex(slug = "", category: ToolCategory = "everyday") {
  let hash = categoryBase[category];
  for (let i = 0; i < slug.length; i += 1) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return hash % accents.length;
}

export function getToolAccent(slug?: string, category?: ToolCategory) {
  return accents[accentIndex(slug, category)];
}

export default function ToolIcon({ icon: Icon, slug, category, size = 19, className = "" }: ToolIconProps) {
  const accent = getToolAccent(slug, category);
  return (
    <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent.bg} ${accent.text} ${className}`} aria-hidden="true">
      <Icon size={size} strokeWidth={1.9} />
    </span>
  );
}
