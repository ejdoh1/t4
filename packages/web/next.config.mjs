/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import NextMdx from "@next/mdx"; // ✅

const withMDX = NextMdx();

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

export default withMDX(config);
