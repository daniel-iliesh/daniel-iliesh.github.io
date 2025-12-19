// @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export if explicitly requested (for GitHub Pages)
  // For admin features with API routes, we need server-side rendering
  output: process.env.BUILD_STATIC === "true" ? "export" : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ["next-mdx-remote"],
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['motion', 'lucide-react', 'react-icons'],
  },
  // Note: When using API routes (for admin authentication), static export is disabled.
  // Set BUILD_STATIC=true if you need static export for GitHub Pages (but admin features won't work).
};
 
module.exports = nextConfig
