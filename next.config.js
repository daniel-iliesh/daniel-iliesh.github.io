// @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : "export",
  trailingSlash: true, // ensure static export generates /blog/index.html, etc. for GH Pages
  images: { unoptimized: true },
  transpilePackages: ["next-mdx-remote"],
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['motion', 'lucide-react', 'react-icons'],
  },
  // Note: For static exports, caching headers should be configured at the hosting level
  // (e.g., GitHub Pages, Netlify, Vercel). WebP files are optimized for faster loading.
};
 
module.exports = nextConfig
