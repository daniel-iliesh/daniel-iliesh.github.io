// @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : "export",
  trailingSlash: true, // ensure static export generates /blog/index.html, etc. for GH Pages
  images: { unoptimized: true },
  transpilePackages: ["next-mdx-remote"],
};
 
module.exports = nextConfig
