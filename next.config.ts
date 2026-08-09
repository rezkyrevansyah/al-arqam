import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
