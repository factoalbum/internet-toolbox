import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";

export const dynamic = "force-static";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    ...categories.map((category) => ({ url: `${baseUrl}/categories/${category.slug}/`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...tools.map((tool) => ({ url: `${baseUrl}/tools/${tool.slug}/`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
