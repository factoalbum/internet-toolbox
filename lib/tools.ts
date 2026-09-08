import { Calculator, Code2, FileText, ImageIcon, Sparkles } from "lucide-react";

export type ToolCategory = "calculators" | "developer" | "text" | "files";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: typeof Calculator;
  status: "live" | "coming-soon";
};

export const categories = [
  { slug: "calculators", name: "Calculators", description: "Quick answers for numbers, money and everyday decisions.", icon: Calculator },
  { slug: "developer", name: "Developer Tools", description: "Fast utilities for coding, data and debugging.", icon: Code2 },
  { slug: "text", name: "Text Tools", description: "Clean, count, transform and prepare text in seconds.", icon: FileText },
  { slug: "files", name: "File & Image Tools", description: "Simple browser-based tools for common file tasks.", icon: ImageIcon },
] as const;

export const tools: Tool[] = [
  { slug: "percentage-calculator", name: "Percentage Calculator", description: "Calculate percentages, increases and decreases instantly.", category: "calculators", icon: Calculator, status: "coming-soon" },
  { slug: "age-calculator", name: "Age Calculator", description: "Find an exact age between two dates.", category: "calculators", icon: Calculator, status: "coming-soon" },
  { slug: "discount-calculator", name: "Discount Calculator", description: "Calculate sale prices and savings quickly.", category: "calculators", icon: Calculator, status: "coming-soon" },
  { slug: "json-formatter", name: "JSON Formatter", description: "Format and inspect JSON with readable indentation.", category: "developer", icon: Code2, status: "coming-soon" },
  { slug: "uuid-generator", name: "UUID Generator", description: "Generate UUIDs instantly in your browser.", category: "developer", icon: Code2, status: "coming-soon" },
  { slug: "word-counter", name: "Word Counter", description: "Count words, characters and reading time.", category: "text", icon: FileText, status: "coming-soon" },
  { slug: "character-counter", name: "Character Counter", description: "Count characters with and without spaces.", category: "text", icon: FileText, status: "coming-soon" },
  { slug: "image-compressor", name: "Image Compressor", description: "Reduce image file size without unnecessary complexity.", category: "files", icon: ImageIcon, status: "coming-soon" },
];

export const featuredTools = tools.slice(0, 6);
export const brandIcon = Sparkles;
