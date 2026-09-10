import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Internet Toolbox",
    short_name: "Toolbox",
    description: "Free online tools for everyday tasks.",
    start_url: "./",
    display: "standalone",
    background_color: "#f3f0e8",
    theme_color: "#171717",
    icons: [{ src: "./icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
