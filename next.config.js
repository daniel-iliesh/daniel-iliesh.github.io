// @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : "export",
  images: { unoptimized: true },
  transpilePackages: ['next-mdx-remote']
}
 
module.exports = nextConfig
