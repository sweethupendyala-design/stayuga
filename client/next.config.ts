import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost", port: "4000", pathname: "/uploads/**" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.up.railway.app", pathname: "/uploads/**" },
    ],
  },
  async redirects() {
    return [
      // The public stays listing moved from /properties to /stays — keep old
      // bookmarks and any indexed links working with a permanent redirect.
      { source: "/properties", destination: "/stays", permanent: true },
      { source: "/properties/:slug", destination: "/stays/:slug", permanent: true },
      // Contact Us now lives inside the About page.
      { source: "/contact", destination: "/about#contact", permanent: true },
    ];
  },
};

export default nextConfig;
