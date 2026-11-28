import { readFileSync } from "node:fs";
import type { NextConfig } from "next";

const { version } = JSON.parse(
  readFileSync("./package.json", "utf8")
) as { version: string };

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  env: {
    APP_VERSION: version,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
