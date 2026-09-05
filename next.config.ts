import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    // Admin bisa paste URL gambar eksternal apa pun (bukan cuma Supabase Storage),
    // jadi remote pattern harus wildcard supaya next/image tetap bisa optimize-nya.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
};

export default nextConfig;
