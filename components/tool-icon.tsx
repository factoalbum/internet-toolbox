import type { LucideIcon } from "lucide-react";
import {
  BadgePercent, Banknote, Binary, Braces, CalendarDays, CandlestickChart, CaseSensitive,
  ChartNoAxesCombined, Clock3, Code2, Coins, FileArchive, FileCode2, FileJson, FileOutput, FileText,
  Files, GitCompare, Globe2, Hash, HeartPulse, Home, ImageIcon, Images, KeyRound, Landmark, Link2, ListX,
  LockKeyhole, MessageSquareText, Percent, PiggyBank, QrCode, ReceiptText, Regex, Ruler, ScanLine,
  ScanSearch, Scale, ShieldCheck, Shuffle, Split, TextCursorInput, Timer, Type, Utensils, WalletCards,
} from "lucide-react";
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

const semanticIcons: Record<string, LucideIcon> = {
  "percentage-calculator": Percent,
  "age-calculator": CalendarDays,
  "discount-calculator": BadgePercent,
  "time-converter": Clock3,
  "time-zone-converter": Globe2,
  "emi-calculator": Banknote,
  "gst-calculator": ReceiptText,
  "bmi-calculator": HeartPulse,
  "sip-calculator": ChartNoAxesCombined,
  "unit-converter": Ruler,
  "date-calculator": CalendarDays,
  "fd-calculator": Landmark,
  "compound-interest-calculator": Coins,
  "income-tax-calculator": ReceiptText,
  "salary-calculator": WalletCards,
  "ppf-calculator": PiggyBank,
  "hra-calculator": Home,
  "currency-converter": Banknote,
  "gold-silver-rate-converter": Coins,
  "position-size-calculator": CandlestickChart,
  "risk-reward-calculator": Scale,
  "trading-profit-loss-calculator": ChartNoAxesCombined,
  "stop-loss-calculator": LockKeyhole,
  "take-profit-calculator": BadgePercent,
  "trading-risk-calculator": ShieldCheck,
  "margin-calculator": WalletCards,
  "leverage-calculator": Scale,
  "break-even-calculator": ReceiptText,
  "average-entry-price-calculator": ChartNoAxesCombined,
  "trading-expectancy-calculator": ChartNoAxesCombined,
  "drawdown-calculator": ChartNoAxesCombined,
  "random-number-generator": Shuffle,
  "tip-calculator": Utensils,
  "bill-splitter": Split,
  "qr-code-generator": QrCode,
  "url-shortener": Link2,
  "message-writer": MessageSquareText,
  "json-formatter": Braces,
  "json-to-csv": FileJson,
  "uuid-generator": KeyRound,
  "password-generator": LockKeyhole,
  "hash-generator": Hash,
  "url-encoder-decoder": Link2,
  "base64-encoder-decoder": Binary,
  "timestamp-converter": Timer,
  "color-converter": Type,
  "html-entity-encoder-decoder": Code2,
  "regex-tester": Regex,
  "jwt-decoder": ShieldCheck,
  "developer-file-viewer": FileCode2,
  "document-similarity-checker": GitCompare,
  "pdf-difference-checker": GitCompare,
  "pdf-visual-comparator": ScanSearch,
  "pdf-layout-checker": ScanLine,
  "pdf-text-extractor": FileText,
  "pdf-metadata-viewer": Files,
  "pdf-page-analyzer": ScanSearch,
  "pdf-merger": FileOutput,
  "pdf-splitter": Split,
  "pdf-to-images": Images,
  "images-to-pdf": FileOutput,
  "pdf-compressor": FileArchive,
  "image-similarity-checker": Images,
  "screenshot-difference-checker": ScanLine,
  "image-metadata-viewer": ImageIcon,
  "image-dimension-checker": Ruler,
  "document-compare": GitCompare,
  "copy-paste-cleaner": TextCursorInput,
  "word-counter": Type,
  "character-counter": Hash,
  "case-converter": CaseSensitive,
  "text-cleaner": ListX,
};

function accentIndex(slug = "", category: ToolCategory = "everyday") {
  let hash = categoryBase[category];
  for (let i = 0; i < slug.length; i += 1) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return hash % accents.length;
}

export function getToolAccent(slug?: string, category?: ToolCategory) {
  return accents[accentIndex(slug, category)];
}

export default function ToolIcon({ icon, slug, category, size = 19, className }: ToolIconProps) {
  const accent = getToolAccent(slug, category);
  const Icon = (slug && semanticIcons[slug]) ?? icon;
  return (
    <span className={`flex ${className ?? "size-11"} shrink-0 items-center justify-center rounded-xl ${accent.bg} ${accent.text}`} aria-hidden="true">
      <Icon size={size} strokeWidth={1.9} />
    </span>
  );
}
