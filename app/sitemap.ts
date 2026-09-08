import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";

const baseUrl = "https://internet-toolbox.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    ...categories.map((category) => ({ url: `${baseUrl}/categories/${category.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...tools.map((tool) => ({ url: `${baseUrl}/tools/${tool.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
