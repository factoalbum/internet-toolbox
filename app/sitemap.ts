import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";

export const dynamic = "force-static";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export default function sitemap(): MetadataRoute.Sitemap {
  const liveTools = tools.filter((tool) => tool.status === "live");
  return [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/tools/`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/categories/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/faq/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact/`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/support/`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy/`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/terms/`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/disclaimer/`, changeFrequency: "yearly", priority: 0.5 },
    ...categories.map((category) => ({ url: `${baseUrl}/categories/${category.slug}/`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...liveTools.map((tool) => ({ url: `${baseUrl}/tools/${tool.slug}/`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
