import type { NextConfig } from "next";

// A static site: GitHub Pages serves it at qso-graph.io/qso-graph-demo-dxpedition/, so the publish
// workflow sets PAGES_BASE_PATH to that path. Unset (npm run dev, a local build) it serves at the root.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true, // each page is <path>/index.html, which Pages serves without a redirect
  images: { unoptimized: true }, // no image server on a static host
};

export default nextConfig;
