import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGitHubPages ? "/internet-toolbox" : "",
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "pdfjs-dist/legacy/build/pdf.mjs": require.resolve("pdfjs-dist/webpack.mjs"),
    };
    return config;
  },
};

export default nextConfig;
